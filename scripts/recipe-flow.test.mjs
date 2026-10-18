import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { compileRecipe } from './recipe-flow.mjs';

const load = name => JSON.parse(readFileSync(new URL(`../_data/recipes/${name}.json`, import.meta.url)));
const copy = value => structuredClone(value);

test('all authored recipes produce complete, non-overlapping tables and portable exports', () => {
  for (const file of readdirSync(new URL('../_data/recipes/', import.meta.url)).filter(f => f.endsWith('.json'))) {
    const source = load(file.slice(0, -5));
    const { recipe, layout, schema } = compileRecipe(source);
    const occupied = new Set();
    for (const cell of layout.cells) {
      for (let r = cell.row; r < cell.row + (cell.rowSpan ?? 1); r++) {
        for (let c = cell.column; c < cell.column + (cell.columnSpan ?? 1); c++) {
          assert.ok(r < layout.rows && c < layout.columns, file);
          assert.ok(!occupied.has(`${r},${c}`), `${file}: overlapping cells`);
          occupied.add(`${r},${c}`);
        }
      }
    }
    assert.equal(occupied.size, layout.rows * layout.columns, file);
    assert.equal(layout.cells.filter(c => c.ingredient !== undefined).length, source.recipeIngredient.length);
    assert.equal(layout.cells.filter(c => c.instruction !== undefined).length, source.recipeInstructions.length);
    assert.deepEqual(schema.recipeIngredient, recipe.recipeIngredient);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.ok(!JSON.stringify(schema).includes('flow:'));
    assert.ok(schema.recipeInstructions.every(s => typeof s.text === 'string'));
  }
});

test('pancake ingredients join at soak, batter, flour and morning soda stages', () => {
  const { layout } = compileRecipe(load('sourdough-pancakes'));
  const ingredient = i => layout.cells.find(c => c.ingredient === i);
  const step = i => layout.cells.find(c => c.instruction === i);
  assert.equal(ingredient(0).columnSpan, 1);
  assert.equal(ingredient(2).columnSpan, step(1).column);
  assert.equal(ingredient(8).columnSpan, step(2).column);
  assert.equal(ingredient(9).columnSpan, step(4).column);
  assert.equal(step(0).rowSpan, 2);
  assert.equal(step(3).rowSpan, 9);
  assert.equal(step(4).rowSpan, 10);
});

test('kombucha branches after brewing without repeating steps', () => {
  const { layout } = compileRecipe(load('solera-style-kombucha'));
  const refill = layout.cells.find(c => c.instruction === 2);
  const bottle = layout.cells.find(c => c.instruction === 1);
  assert.equal(refill.column, bottle.column);
  assert.ok(refill.row + refill.rowSpan <= bottle.row);
  assert.equal(layout.cells.find(c => c.ingredient === 0).columnSpan, bottle.column);
});

test('unknown inputs and cycles fail instead of producing a misleading diagram', () => {
  const missing = copy(load('sourdough-pancakes'));
  missing.recipeInstructions[0]['flow:inputs'][0]['@id'] = '#missing';
  assert.throws(() => compileRecipe(missing), /unknown input/i);
  const cycle = copy(load('sourdough-pancakes'));
  cycle.recipeInstructions[0]['flow:inputs'].push(copy(cycle.recipeInstructions.at(-1)['flow:output']));
  assert.throws(() => compileRecipe(cycle), /cycle/i);
});

test('duplicate IDs, unused ingredients and reused raw ingredients are rejected', () => {
  const duplicate = copy(load('sourdough-pancakes'));
  duplicate.recipeIngredient[1]['@id'] = duplicate.recipeIngredient[0]['@id'];
  assert.throws(() => compileRecipe(duplicate), /duplicate/i);
  const unused = copy(load('sourdough-pancakes'));
  unused.recipeInstructions[0]['flow:inputs'].shift();
  assert.throws(() => compileRecipe(unused), /unused ingredient/i);
  const reused = copy(load('sourdough-pancakes'));
  reused.recipeInstructions[1]['flow:inputs'].push({'@id': reused.recipeIngredient[0]['@id']});
  assert.throws(() => compileRecipe(reused), /ingredient.*once/i);
});

test('independent preparations merge according to inputs, regardless of list order', () => {
  const source = {
    '@context': ['https://schema.org', {flow: 'https://ashgillman.github.io/ns/recipe-flow#'}],
    '@type': 'Recipe', name: 'Two mixtures',
    recipeIngredient: ['a', 'b', 'c'].map(id => ({'@id': `#${id}`, '@type': 'PropertyValue', name: id})),
    recipeInstructions: [
      {'@id': '#join', '@type': 'HowToStep', name: 'Join', text: [], 'flow:inputs': [{'@id': '#left'}, {'@id': '#right'}], 'flow:output': {'@id': '#done'}},
      {'@id': '#mix-left', '@type': 'HowToStep', name: 'Left', text: [], 'flow:inputs': [{'@id': '#a'}, {'@id': '#b'}], 'flow:output': {'@id': '#left'}},
      {'@id': '#mix-right', '@type': 'HowToStep', name: 'Right', text: [], 'flow:inputs': [{'@id': '#c'}], 'flow:output': {'@id': '#right'}}
    ]
  };
  const { layout, schema } = compileRecipe(source);
  assert.equal(layout.cells.find(c => c.instruction === 0).column, 2);
  assert.deepEqual(schema.recipeInstructions.map(s => s.name), ['Left', 'Right', 'Join']);
});

test('unsupported branching fails clearly without inventing connections', () => {
  const source = copy(load('solera-style-kombucha'));
  source.recipeIngredient.push({'@id': '#extra-water', '@type': 'PropertyValue', name: '100 mL water'});
  source.recipeInstructions[2]['flow:inputs'].push({'@id': '#extra-water'});
  assert.throws(() => compileRecipe(source), /unsupported layout: only one final branch can add ingredients/);
  const continuing = copy(load('solera-style-kombucha'));
  continuing.recipeInstructions.push({
    '@id': '#serve', '@type': 'HowToStep', name: 'Serve', text: [],
    'flow:inputs': [copy(continuing.recipeInstructions[1]['flow:output'])],
    'flow:output': {'@id': '#served-kombucha'}
  });
  assert.throws(() => compileRecipe(continuing), /unsupported layout: shared preparation must branch into final steps/);
});

test('exports preserve standard metadata and timing without leaking graph fields', () => {
  const source = copy(load('sourdough-pancakes'));
  source.recipeInstructions[0].url = 'https://example.org/recipes/pancakes#soak';
  const { schema } = compileRecipe(source);
  assert.equal(schema.recipeInstructions[0].url, source.recipeInstructions[0].url);
  assert.match(schema.recipeInstructions[0].text, /^Day 1/);
  assert.ok(!JSON.stringify(schema).includes('flow:'));
  const doughnuts = compileRecipe(load('sourdough-doughnuts')).schema;
  assert.ok(doughnuts.recipeInstructions.every(s => !s.text.includes('..')));
  assert.equal(compileRecipe(load('sourdough')).schema.recipeInstructions[1].text, 'Add salt');
});
