---
title: A brain imaging workshop for NeuroSTEM 2026
author: Ashley Gillman
layout: post
permalink: /neurostem-2026/
tags: [Neuroscience, STEM, Python, Medical Imaging]
excerpt: A Jupyter notebook workshop for NeuroSTEM, exploring brain images, image alignment and what we can learn from a group of volunteers.
---

This Saturday I will be running a brain imaging and coding workshop for [JCU's NeuroSTEM day](https://www.jcu.edu.au/news/releases/2026/august/de-stress-and-expand-your-brain-at-neurostem) in Townsville.
The event brings Year 10 and 11 students together to learn about the brain and stress, with activities covering anatomy, physiology and imaging.
I've put together a Jupyter notebook for my session, which you can open here:

<nav class="workshop-links" aria-label="Workshop resources">
  <a class="workshop-link workshop-link-primary" href="https://gesis.mybinder.org/v2/gh/ashgillman/FDG-PET-Registration-2D-workshop/HEAD?urlpath=%2Fdoc%2Ftree%2FNeuroPET_exercise.ipynb">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><circle cx="12" cy="17" r="4"/></svg>
    Open notebook on Binder
  </a>
  <a class="workshop-link" href="https://github.com/ashgillman/FDG-PET-Registration-2D-workshop">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .7a11.3 11.3 0 0 0-3.57 22c.56.1.77-.24.77-.54v-2.1c-3.15.68-3.82-1.34-3.82-1.34-.51-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.39-1.23.71-1.51-2.51-.29-5.15-1.26-5.15-5.59 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .95-.31 3.1 1.16a10.8 10.8 0 0 1 5.65 0c2.16-1.47 3.1-1.16 3.1-1.16.61 1.56.23 2.71.11 3 .72.79 1.16 1.8 1.16 3.03 0 4.34-2.64 5.3-5.16 5.58.41.35.77 1.04.77 2.1v3.1c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z"/></svg>
    View on GitHub
  </a>
</nav>

If you're attending the workshop, use the Binder button to run the notebook in your browser.
You don't need to install anything or have programmed before; the code is supplied.
Binder can take a few minutes to start, so give it some time to load.

The idea is to work through some of the steps involved in using brain images for a research study.
In particular, it explores registration, extracting PET biomarkers, and statistical analysis

The lab uses synthetic data -- it isn't real patient data, but the images appear real enough to give intuition into real scientific analysis pipelines.

The [GitHub repository](https://github.com/ashgillman/FDG-PET-Registration-2D-workshop) includes the notebook, a facilitator guide and presenter notes.
If you're putting together a similar STEM activity, you're welcome to use or adapt them; the README has the licence and attribution details.
