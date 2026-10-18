---
layout: page
title: Recipes
permalink: /recipes/
---
<link rel="stylesheet" href="{{ '/css/recipes.css' | relative_url }}?v={{ site.time | date: '%s' }}">
{% for pair in site.data.recipes %}
  {% assign recipe_key = pair[0] %}
  {% assign recipe = pair[1] %}
  {% assign layout = site.data.trn[recipe_key] %}
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
{% for pair in site.data.recipes %}{% unless forloop.first %},{% endunless %}{{ pair[1] | jsonify }}{% endfor %}
]
</script>
