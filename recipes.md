---
layout: page
title: Recipes
permalink: /recipes/
---
<link rel="stylesheet" href="{{ '/css/recipes.css' | relative_url }}?v={{ site.time | date: '%s' }}">
{% for entry in site.data.recipe_views %}
  {% assign recipe = entry.recipe %}
  {% assign layout = entry.layout %}
<article class="recipe">
  <h2>{{ recipe.name | escape }}</h2>
  {% include trn-table.html recipe=recipe layout=layout %}
</article>
{% endfor %}

<footer class="recipe-credit">
  Tabular Recipe Format used here was developed by Micahel Chu at <a href="https://www.cookingforengineers.com/">Cooking for Engineers</a>
</footer>

<script type="application/ld+json">
[
{% for entry in site.data.recipe_views %}{% unless forloop.first %},{% endunless %}{{ entry.schema | jsonify }}{% endfor %}
]
</script>
