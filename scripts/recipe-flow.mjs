import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const FLOW = 'https://ashgillman.github.io/ns/recipe-flow#';

// The graph describes the cooking process. Table coordinates exist only here.
export function compileRecipe(source) {
  const fail = message => { throw new Error(`${source.name ?? 'Recipe'}: ${message}`); };
  const requireText = (value, label) => {
    if (typeof value !== 'string' || !value.trim()) fail(`${label} must be non-empty text`);
    return value;
  };
  if (source['@type'] !== 'Recipe') fail('expected a Schema.org Recipe');
  requireText(source.name, 'name');
  if (!Array.isArray(source['@context']) || !source['@context'].includes('https://schema.org') ||
      !source['@context'].some(c => c?.flow === FLOW)) fail('missing recipe flow context');
  if (!Array.isArray(source.recipeIngredient) || !source.recipeIngredient.length ||
      !Array.isArray(source.recipeInstructions) || !source.recipeInstructions.length) {
    fail('ingredients and instructions must be non-empty arrays');
  }

  const ids = new Set();
  const register = (object, label) => {
    const id = object?.['@id'];
    if (typeof id !== 'string' || !/^#[a-z][a-z0-9-]*$/.test(id)) fail(`${label} needs a local #id`);
    if (ids.has(id)) fail(`duplicate ID ${id}`);
    ids.add(id);
    return id;
  };
  const nodes = new Map();
  const ingredients = source.recipeIngredient.map((item, index) => {
    if (item['@type'] !== 'PropertyValue') fail('ingredients must be PropertyValue objects');
    const node = { id: register(item, 'ingredient'), ingredient: index, label: requireText(item.name, 'ingredient name'), users: [] };
    nodes.set(node.id, node);
    return node;
  });
  const steps = source.recipeInstructions.map((item, index) => {
    if (item['@type'] !== 'HowToStep') fail('instructions must be HowToStep objects');
    register(item, 'step');
    requireText(item.name, 'step name');
    const details = typeof item.text === 'string' ? [item.text] : item.text;
    if (!Array.isArray(details) || details.some(t => typeof t !== 'string')) fail(`${item.name}: text must be a string or string array`);
    if (item['flow:timing'] !== undefined) requireText(item['flow:timing'], 'timing');
    if (!Array.isArray(item['flow:inputs']) || !item['flow:inputs'].length) fail(`${item.name}: missing inputs`);
    const node = { id: register(item['flow:output'], 'output'), instruction: index, item, details, users: [] };
    nodes.set(node.id, node);
    return node;
  });
  for (const node of steps) {
    const seen = new Set();
    node.inputs = node.item['flow:inputs'].map(ref => {
      const input = nodes.get(ref?.['@id']);
      if (!input) fail(`${node.item.name}: unknown input ${ref?.['@id']}`);
      if (seen.has(input.id)) fail(`${node.item.name}: repeated input ${input.id}`);
      seen.add(input.id);
      input.users.push(node);
      return input;
    });
  }

  // Resolve dependency order independently of the author's instruction order.
  const visiting = new Set();
  const visited = new Set();
  const ordered = [];
  function visit(node) {
    if (visiting.has(node)) fail(`cycle involving ${node.id}`);
    if (visited.has(node)) return;
    visiting.add(node);
    if (node.inputs) {
      node.inputs.forEach(visit);
      node.depth = Math.max(...node.inputs.map(n => n.depth)) + 1;
      node.height = node.inputs.reduce((sum, n) => sum + n.height, 0);
      ordered.push(node);
    } else {
      node.depth = 0;
      node.height = 1;
    }
    visiting.delete(node);
    visited.add(node);
  }
  steps.forEach(visit);
  for (const ingredient of ingredients) {
    if (!ingredient.users.length) fail(`unused ingredient ${ingredient.id}`);
    if (ingredient.users.length > 1) fail(`ingredient ${ingredient.id} must be used once; split quantities into separate ingredient entries`);
  }

  const cells = [];
  function emitTree(node, row, untilColumn, extraRows = 0) {
    const height = node.height + extraRows;
    if (!node.inputs) {
      cells.push({ ingredient: node.ingredient, row, column: 0, rowSpan: height, columnSpan: untilColumn });
      return;
    }
    let childRow = row;
    node.inputs.forEach((input, i) => {
      const extra = i === node.inputs.length - 1 ? extraRows : 0;
      emitTree(input, childRow, node.depth, extra);
      childRow += input.height + extra;
    });
    cells.push({ instruction: node.instruction, row, column: node.depth, rowSpan: height, columnSpan: untilColumn - node.depth });
  }

  const forks = steps.filter(n => n.users.length > 1);
  let rows;
  let columns;
  if (!forks.length) {
    // Independent preparation trees may merge; independent final outputs stack.
    const roots = steps.filter(n => !n.users.length);
    columns = Math.max(...roots.map(n => n.depth)) + 1;
    rows = 0;
    for (const root of roots) {
      emitTree(root, rows, columns);
      rows += root.height;
    }
  } else {
    // A shared preparation can split into terminal uses, e.g. tea for two uses.
    // More general DAGs need routing, not guessed cell spans: fail explicitly.
    if (forks.length !== 1) fail('unsupported layout: multiple shared preparations');
    const shared = forks[0];
    const branches = [...shared.users];
    if (branches.some(n => n.users.length || n.inputs.some(i => i !== shared && i.inputs))) {
      fail('unsupported layout: shared preparation must branch into final steps with only new ingredients');
    }
    const withExtras = branches.filter(n => n.inputs.length > 1);
    if (withExtras.length > 1) fail('unsupported layout: only one final branch can add ingredients');
    // Place the branch adding ingredients last, so the shared mixture stays contiguous.
    branches.sort((a, b) => Number(a.inputs.length > 1) - Number(b.inputs.length > 1));
    const ancestors = new Set();
    function collect(node) { ancestors.add(node); node.inputs?.forEach(collect); }
    collect(shared);
    if (steps.some(n => !ancestors.has(n) && !branches.includes(n))) fail('unsupported layout: separate outputs alongside a shared preparation');
    const sharedRows = Math.max(shared.height, branches.length);
    const branchColumn = shared.depth + 1;
    columns = branchColumn + 1;
    emitTree(shared, 0, branchColumn, sharedRows - shared.height);
    let row = 0;
    branches.forEach((branch, index) => {
      const inherited = Math.floor(sharedRows / branches.length) + (index < sharedRows % branches.length ? 1 : 0);
      const extras = branch.inputs.filter(n => n !== shared);
      extras.forEach((input, i) => emitTree(input, row + inherited + i, branchColumn));
      cells.push({ instruction: branch.instruction, row, column: branchColumn, rowSpan: inherited + extras.length, columnSpan: 1 });
      row += inherited + extras.length;
    });
    rows = row;
  }

  // Check generated geometry as a build invariant, including every grid position.
  const occupied = new Set();
  for (const cell of cells) {
    for (let r = cell.row; r < cell.row + cell.rowSpan; r++) {
      for (let c = cell.column; c < cell.column + cell.columnSpan; c++) {
        const key = `${r},${c}`;
        if (r >= rows || c >= columns || occupied.has(key)) fail('generated layout overlaps or exceeds its bounds');
        occupied.add(key);
      }
    }
  }
  if (occupied.size !== rows * columns || cells.length !== ingredients.length + steps.length) {
    fail('generated layout is incomplete');
  }

  const standardMetadata = Object.fromEntries(Object.entries(source).filter(([key]) =>
    !key.startsWith('flow:') && !['@context', 'recipeIngredient', 'recipeInstructions'].includes(key)));
  const schema = {
    '@context': 'https://schema.org', ...standardMetadata,
    recipeIngredient: ingredients.map(n => n.label),
    recipeInstructions: ordered.map(n => ({
      ...Object.fromEntries(Object.entries(n.item).filter(([key]) => !key.startsWith('flow:') && key !== '@id')),
      text: [n.item['flow:timing'] ? `${n.item['flow:timing'].replace(/[.!?]$/, '')}.` : '', ...n.details].filter(Boolean).join(' ') || n.item.name
    }))
  };
  const recipe = {
    ...standardMetadata,
    recipeIngredient: ingredients.map(n => n.label),
    recipeInstructions: steps.map(n => ({ name: n.item.name, timing: n.item['flow:timing'], text: n.details }))
  };
  return { recipe, schema, layout: { rows, columns, cells } };
}

export function generateRecipes(projectRoot, buildSource) {
  const directory = join(projectRoot, '_data', 'recipes');
  const views = readdirSync(directory).filter(f => f.endsWith('.json')).sort().map(file => {
    const source = JSON.parse(readFileSync(join(directory, file), 'utf8'));
    return { key: file.slice(0, -5), ...compileRecipe(source) };
  });
  writeFileSync(join(buildSource, '_data', 'recipe_views.json'), JSON.stringify(views, null, 2) + '\n');
  console.log(`Generated ${views.length} recipe diagrams from ingredient flow.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 4) throw new Error('Usage: node scripts/recipe-flow.mjs PROJECT_ROOT BUILD_SOURCE');
  generateRecipes(process.argv[2], process.argv[3]);
}
