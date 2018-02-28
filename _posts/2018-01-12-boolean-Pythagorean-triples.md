---
title: >-
  Journal Club: Solving and verifying the Boolean Pythagorean triples problem
  via cube-and-conquer
author: Ashley Gillman
layout: post
tags: Journal Club, Mathematics
---

Last year I read the Nature press release [reporting on the largest ever
mathematical
proof](http://www.nature.com/news/two-hundred-terabyte-maths-proof-is-largest-ever-1.19990),
which came in at ~200 TB. This article interested me, not for the solution to
the problem itself, which was the boolean Pythagorean Triples problem, but
rather the process for proving such a theorem. Of course, computer science began
with logic and mathematical proofs, but I was interested to know more about how
a modern computational proof was formulated. The paper that the news article
references is [Solving and verifying the Boolean Pythagorean Triples via
cube-and-conquer by M. Hule, O. Kullmann and V.
Marek](https://arxiv.org/abs/1605.00723), and is what I will be covering.

### _Introduction_

The article presents a solution to the Boolean Pythagorean triples problem. A
[Pythagorean triple](https://en.wikipedia.org/wiki/Pythagorean_triple) is a set of three natural numbers satisfying the following
equation:

$$
  x^2 + y^2 = z^2
$$

Pythagorean triples have stirred a lot of interest in the field of mathematics.
YouTuber Mathologer recently released an interesting
[video](https://www.youtube.com/watch?v=p-0SOWbzUYI) on proofs for the
Pythagorean identity.

The [Boolean Pythagorean triple
problem](https://en.wikipedia.org/wiki/Boolean_Pythagorean_triples_problem) asks
whether the set of natural numbers up to $$N$$ can be divided into two subsets,
each of which contain no Pythagorean triples. The "Boolean" in the name of the
problem refers to the fact that each number will belong to one of the two
subsets. The proof in this paper demonstrates that the set $${1, ..., 7824}$$
can be divided in this way into two subsets, but the set $${1, ..., 7825}$$, or
any larger $$N$$, cannot.

This problem doesn't immediately seem that hard to brute force... Only 7825? But
the problem lies in the complexity class
[NP](https://en.wikipedia.org/wiki/NP_(complexity)), and the exponential problem
of combinatorics means that this is actually very difficult. As Marijn Huele,
the author, [writes](https://www.cs.utexas.edu/~marijn/ptn/):

> "Even if we could place on every particle in the universe a super-computer,
> and they all would work perfectly together for the whole lifetime of the
> universe -- by far not enough.

It gets a little verbose, but he continues:

> Even not if inside every particle we could
> place a whole universe. Even if each particle in the inner universe becomes
> again itself a universe, with every particle carrying a super-computer, still
> by far not enough."

So no brute forcing. This type of mathematics belongs to the subfield [Extermal
Combinatorics](https://www.ti.inf.ethz.ch/ew/lehre/extremal07/index.html) --
which asks *"Given that a set must satisfy some property, what is the largest or
smallest (i.e., the most extreme) set that can do so?"* The authors give another
example of extremal combinatorics in the van der Waerden Theorm: which asks for
a set $${1, ..., N}$$, which will be split into $$k$$ subsets, what is the
longest arithmetic progression guaranteed to appear. Recall that an arithmetic
progression is a progression of numbers a constant difference apart ($$1, 2, 3,
...$$ or $$1, 3, 5, ...$$). It is actually asked backwards, so that
$$\texttt{vdW}(k, l)=N$$. So $$\texttt{vdW}(2, 6)=1132$$ means that the numbers
one to 1132, when split into two subsets, will always have an arithmetic
progression six numbers long in one of the subsets. Or rather, for two
subsets, in order to guarantee an arithmetic sequence of length six, you need
numbers one to 1132.

Back to our Boolean Pythagorean triples problem: the authors note that for the
first part of the proof, that we can successfully divide $${1, ..., 7824}$$, is
easy to show. We just have to find an example. But showing that $${1, ...,
7825}$$ is impossible, without inspecting all $$3.63 \times 10^{2355}$$
possibilities, is much harder. And thus ends the Introduction section. Phew!

### _Getting settled in with the Preliminaries_
There are quite a few concepts to get your head around for the uninitiated, like
myself. We are reducing everything in the proof to boolean formulas. This means
all our variables (or rather, literals: this is different to programming
terminology) are booleans, and use operations like:

- And ($$a \land b$$)
- Or ($$a \lor b$$)
- Not ($$\neg a$$)
- Implication ($$a \models b$$), meaning if $$a$$ is satisfied, $$b$$ must also
  be. For example if $$x$$ _and_ $$y$$ are true, then we know $$x$$ must be
  true, so $$(x \land y) \models x$$.

If the formula reduces to 1, it is satisfiable, otherwise it is unsatisfiable.
Our formulas will be in conjunctive normal form (CNF) -- basically we will set
up our formulas at the top level to only have _Ors_, and each _or-ed_ value will
consist only of _Ands_. For example:

$$(a \lor b) \land (d \lor c \lor \neg d) \land \neg e$$

