---
title: >-
  Journal Club: Two-hundred-terabyte maths proof is largest ever
subtitle: >-
  Solving and verifying the Boolean Pythagorean triples problem via
  cube-and-conquer
meta: >-
  1TJC Presentation
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

### Introduction

The article presents a solution to the Boolean Pythagorean triples problem. A
[Pythagorean triple](https://en.wikipedia.org/wiki/Pythagorean_triple) is a set
of three natural numbers satisfying the following equation:

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

### Getting settled in with the Preliminaries

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

If a formula reduces to 1 (or True) for some set of inputs, it is _satisfiable_
(SAT), otherwise, if no possible set of inputs can make the formula result in
True, it is _unsatisfiable_ (UNSAT). Our formulas will be in conjunctive normal
form (CNF) -- basically we will set up our formulas at the top level to only
have _Ors_, and each _or-ed_ value will consist only of _Ands_. For example:

$$(a \lor b) \land (d \lor c \lor \neg d) \land (\neg e)$$

So we can think of our formula as a list of clauses, which will be reduced using
the AND operation, and each of our clauses as a list of literals, which will be
reduced by the OR operation. Another important detail to consider is "what if
one of our clauses is an empty list?" If we think of a clause as a list of
literals being
[reduced](https://martinfowler.com/articles/collection-pipeline/reduce.html) on
the OR operation, then it is easily seen that False is the identity under this
operation (anything OR False equals whatever that anything was), so the empty
clause, denoted by $$\perp$$, [evaluates to
False](https://en.wikipedia.org/wiki/Clause_(logic)#Empty_clauses).

In order to prove a formula is unsatisfiable, we will add more and more clauses,
each of which is consistent with the existing clauses in the formula, until we
find a contradiction, or a conflict. This equates to a proof by conflict, and
shows that the formula is inconsistent and cannot be satisfied.

As we add clauses in our proof, we have to be sure that the new clauses are
consistent with the formula. In our above example for implication, we saw that
$$(x \land y) \models x$$. Imagine that $$x$$ and $$y$$ and actually clauses,
not just literals, $$(X \land Y) \models X$$. We could see that if the LHS is
SAT, it would mean that both $$X$$ and $$Y$$ are satisfiable, so we would know
then that the RHS is also SAT. So transforming via implication is
SAT-preserving. However, if the LHS is UNSAT, then we can't say whether the RHS
is SAT or UNSAT. In order to construct our proofs, we need to ensure that all
the clauses are SAT-equivalent, that they don't change the satisfiability or
unsatisfiability of the formula as a whole.

#### _Resolution and Extended Resolution_

It is my understanding that resolution was an early technique for automated
satisfiability computation, and extended resolution a generalisation; and that
the technique used in the proofs in this paper, resolution asymmetric tautology
(RAT) is a further generalisation. Therefore, you can safely skip through this
section which I believe is just for historical reasons.

Both resolution and extended resolution allow you to add new, consistent and
SAT-equivalent clauses to a proof.

In resolution, we can add the _resolvent_, $$C$$, of two clauses $$C_1$$ and
$$C_2$$, where $$C_1 = (x \lor A)$$, $$C_2 = (\bar{x} \lor B)$$, $$C = (A \lor
B)$$, and $$\bar{x}$$ is the compliment of $$x$$. It can be seen that $$C_1
\land C_2 \models C$$, by considering that for $$C_1$$ to be true, at least one
of $$A$$ and $$B$$ must be true since only one of $$x$$ and $$\bar{x}$$ is true.
We said before that implication is SAT-preserving, and we can convince ourselves
that clause addition (by AND) should be UNSAT-preserving, so:

$$
(x \lor A) \land (\bar{x} \lor B) \land (A \lor B)
\equiv (x \lor A) \land (\bar{x} \lor B)
\\
\text{since} \quad (x \lor A) \land (\bar{x} \lor B)
  \models (A \lor B) \quad \text{is SAT-preserving}
\\
\text{and clause addition is UNSAT-preserving}
$$

So if we have $$C_1$$ and $$C_2$$ in our formula, we can safely add $$C$$ as a
part of out proof.

In extended resolution, there is an additional option to add a new variable,
$$x$$. We define the new variable as $$x = a \lor b$$, where $$a$$ and $$b$$ are
literals in the current formula. The definition is added by adding the clauses:

$$
(x \lor \bar{a} \lor \bar{b}) \land (\bar{x} \lor a) \land (\bar{x} \lor b)
$$

This can be seen to equivalent to defining $$x = a \lor b$$ by considering the
two option of $$x$$ being True or False:

$$
\require{cancel}
\require{enclose}
\def\strike#1{\enclose{horizontalstrike}{#1}}
\begin{align*}
\text{if} \:\: x     & \qquad     \text{if} \:\: \bar{x}
\\
\strike{(x \lor \bar{a} \lor \bar{b})}
  \land (\bcancel{\bar{x}} \lor a) \land (\bcancel{\bar{x}} \lor b)
& \qquad
(\bcancel{x} \lor \bar{a} \lor \bar{b})
  \land \strike{(\bar{x} \lor a)} \land \strike{(\bar{x} \lor b)}
\\
a \land b
& \qquad
\bar{a} \lor \bar{b}
\\
x
& \qquad
\bar{x}
\end{align*}
$$

However, I am not entirely sure how introducing such clauses can help lead to a
contradiction.

#### _Unit Propagation_

If a formula contains clauses with a single literal, they make other clauses
within the formula containing the same literal redundant. Consider the
following:

$$
(a) \land (a \lor b) \land \ldots
$$

In order for the formula to be True, $$a$$ must true, so the value of $$b$$
becomes redundant, as does the entire second clause. If the formula in UNSAT,
still the second clause makes no difference. So:

$$
(a) \land \strike{(a \lor b)} \land \ldots \vdash_1 (a) \land \ldots
$$

Where $$\vdash_1$$ means _unit propagates to_. Similarly, if a formula contains
a clause with a single literal, then the compliment of the literal becomes
redundant in other clauses, since to be SAT the literal must be True, and so the
compliment must be False. So:

$$
\begin{align*}
(a) \land (\bcancel{\bar{a}} \lor b) \land (\bar{b} \lor c) \land \ldots
& \vdash_1 (a) \land (b) \land (\bcancel{\bar{b}} \lor c) \land \ldots
\\
& \vdash_1 (a) \land (b) \land (c) \land \ldots
\end{align*}
$$

The last example shows that this process can be iterated until no further
changes are found.

If a conflict is found, where two complimentary unit clauses are produced, the
second rule says that the literals can be eliminated from the clauses, leaving
empty clauses:

$$
\begin{align*}
(a) \land (\bcancel{\bar{a}} \lor b) \land (\bar{b} \lor \bcancel{\bar{a}})
& \vdash_1 (a) \land (\bcancel{b}) \land (\bcancel{\bar{b}})
\\
& \vdash_1 (a) \: \land \perp
\end{align*}
$$

We say that this _derives a conflict_, or symbolically $$F \vdash_1 \perp$$.
Such a formula is UNSAT. In the above formula, $$(a) \land (\bar{a} \lor b)
\land (b \lor \bar{a})$$, no combination of assigning True or False to $$a$$ and
$$b$$ will result in True.

I wrote a simple Python function that is able to perform unit propagation
[here](https://github.com/ashgillman/bst/blob/74b30c5b265ca5d9535ec1ff2074976da01d5fc2/main.py#L114).

#### _Resolution Asymmetric Tautology_

In this work, the authors use a more flexible technique for introducing clauses,
called resolution asymmetric tautology, or RAT. They provide a definition for
RAT which allows introduction of clauses $$C$$ which needn't be logically
implied by a formula. This introduces a flexible way to add new clauses.
Although $$C$$ needn't be logically implied by the formula, it is required that
$$F \land \neg(C \cup (D \backslash \{\bar{x}\})) \vdash_1 \perp$$ for all $$D
\in F$$ in which $$\bar{x} \in D$$, where $$F$$ is the formula, $$C$$ is the
clause to be introduced, $$D$$ is a subset of $$F$$ containing $$\bar{x}$$,
$$x$$ is a pivot element, $$x \in C$$, $$\backslash$$ is set subtraction, and
the negation of a clause, $$\neg C$$ is defined as $$\neg (a \lor b \lor c \lor
...) = ((\neg{a}) \land (\neg{b}) \land (\neg{c}))$$.

This is all quite a mouthful, I wrote a Python function to implement this check
that I find easier to read
[here](https://github.com/ashgillman/bst/blob/74b30c5b265ca5d9535ec1ff2074976da01d5fc2/main.py#L144).

### DRAT and DIMACS

[DIMACS CNF](http://people.sc.fsu.edu/~jburkardt/data/cnf/cnf.html) is a format
for storing formulae in a plaintext, machine-readable format. The first line is
a header, which is `p cnf <n-variables> <n-clauses>`, which defines the number
of variables and clauses. Subsequent lines defines a clauses, each terminated
with a 0. Each value indexes (starting from 1) a variable, and negative values
indicate the compliment of a literal.

The example given in the paper could be worded:

- $$a$$, $$b$$ and $$\bar{c}$$ can't all be the same,
- $$b$$, $$c$$ and $$\bar{d}$$ can't all be the same,
- $$\bar{a}$$, $$b$$, $$d$$ and can't all be the same,
- and $$a$$, $$c$$ and $$d$$ can't all be the same.

This can be captured by the formula:

$$
\begin{align*}
      & (a \lor b \lor \bar{c}) \land (\bar{a} \lor \bar{b} \lor c)
\\
\land & (b \lor c \lor \bar{d}) \land (\bar{b} \lor \bar{c} \lor d)
\\
\land & (\bar{a} \lor b \lor d) \land (a \lor \bar{b} \lor \bar{d})
\\
\land & (a \lor c \lor d) \land (\bar{a} \lor \bar{c} \lor \bar{d})
\end{align*}
$$

Or in DIMACS CNF:

```
p cnf 4 8
 1 2 -3 0  -1 -2  3 0
 2 3 -4 0  -2 -3  4 0
-1 2  4 0   1 -2 -4 0
 1 3  4 0  -1 -3 -4 0
```

The authors also present a DRAT proof to prove the formula is UNSAT. The proof
might say:

- The clause $$C_1=(\bar{a})$$ has RAT on $$\bar{a}$$ w.r.t. $$F$$.
- NB: The clause $$(\bar{a} \lor b \lor d)$$ in $$F$$ will not play a role in
  the remainder of this proof, so you may choose to ignore it.
- The clause $$C_2=(b)$$ has RAT on $$b$$ w.r.t. $$F \land C_1$$.
- $$F \land C_1 \land C_2 \vdash_1 \perp$$, $$\therefore$$ $$F$$ derives a
  conflict and $$F$$ is unsatisfiable.

In DRAT format, this proof would be:

```
  -1 0
d -1 2 4 0
   2 0
   0
```

It should be highlighted that deletions are not integral to the proof, but just
allow acceleration of the verification.

We can manually perform a small amount of the check that the first clause,
$$C_1=(\bar{a})$$ has RAT. We are working with pivot $$a$$, which is taken to be
the first literal presented of each proof clause. First we find $$D$$, which is
the subset of $$F$$ which contains the pivot, in this case $$D=\{(a \lor b \lor
\bar{c}), (a \lor \bar{b} \lor \bar{d}), (a \lor c \lor d)\}$$. For each $$D$$
we should assert that $$F \land \neg(C \cup (D_i \backslash \{\bar{x}\}))
\vdash_1 \perp$$. We will only manually check for $$D_i = (a \lor b \lor
\bar{c})$$.

$$
\begin{align*}
F \land \neg(C \cup (D_1 \backslash \{\bar{x}\}))
&=& F \land (a) \land (\bar{b}) \land (c)
\\
&=& \strike{(a \lor b \lor \bar{c})}
  \land \strike{(\bar{a} \lor \bar{b} \lor c)}
\\
&& \land \strike{(b \lor c \lor \bar{d})}
  \land \strike{(\bar{b} \lor \bar{c} \lor d)}
\\
&& \land (\bcancel{\bar{a}} \lor \bcancel{b} \lor d)
  \land \strike{(a \lor \bar{b} \lor \bar{d})}
\\
&& \land \strike{(a \lor c \lor d)}
  \land (\bcancel{\bar{a}} \lor \bcancel{\bar{c}} \lor \bar{d})
\\
&& \land (a) \land (\bar{b}) \land (c)
\\
&\vdash_1& (a) \land (\bar{b}) \land (c)
  \land (\bcancel{d}) \land (\bcancel{\bar{d}})
\\
&\vdash_1& \perp
\end{align*}
$$

This process is repeated for all $$D$$ to ensure that the clause
indeed has RAT w.r.t. the formula. After this has been ensured, the clause can
be added to the formula and the next clause checked. After all clauses have been
checked, the formula should derive a conflict after unit propagation in order to
UNSAT to be demonstrated.

Again, a Python implementation of the process can be found
[here](https://github.com/ashgillman/bst/blob/74b30c5b265ca5d9535ec1ff2074976da01d5fc2/main.py#L165).

This certainly concludes what I found to be the trickiest and most interesting
part of the paper (at least to someone outside of the field -- it is likely this
was actually very fundamental and routine).

### Cube and Conquer

The cube and conquer strategy used to solve sounds very similar to the
techniques used in dynamic programming. The problem is broken down into chunks
using heuristics, which can be solved independently. Actually, the problem is
broken down into chunks in two stages: at the first level each chunk is to be
solved independently. Each chunk is then broken into smaller chunks, which are
solved sequentially so that learned heuristics from previous sub-chunks can be
used to accelerate solving.

### Solving

#### _Encoding_

The framework for solving is divided into five steps. In the first, the problem
must be encoded into DIMACS CNF format. Marijn provides the C code used for this
step:

{% gist 7858462290bab7e1faec8dc29f249268 %}

I also [implemented an
encoder](https://github.com/ashgillman/bst/blob/74b30c5b265ca5d9535ec1ff2074976da01d5fc2/main.py#L73)
for a much simpler problem (Boolean sum problem) that colours triplets of the
form $$(a, b, c)$$ of the form $$a + b = c$$ as opposed to $$a\cdot{}a +
b\cdot{}b = c\cdot{}c$$.

<!--
```python
def encode_bst(n):
    """Encodes the Boolean Sum Triples up to n in DIMACS CNF format."""
    cnf = []
    for a in range(1, n - 1):
        for b in range(a + 1, n - a + 1):
            c = a + b
            cnf.append([a, b, c])
            cnf.append([-a, -b, -c])

    out_f = 'bst_plain_{}.cnf'.format(n)
    write_cnf(n, cnf, out_f)

return cnf
```
-->

#### _Transform_

In order to simplify the solving, the authors iteratively remove any clauses
where one of the literals only appears twice (the positive and negative form of
the clause). Since the literal doesn't appear in other triples, it can trivially
be assigned to ensure the colouring isn't all the same. They also break the
symmetry in which one could swap all True labels with False and vice-versa, by
adding a clause that makes the most common literal True.

#### _Split_

The details of the heuristics used aren't focused on in this review. In short,
variables are set to True or False, and the importance of the resulting new
clauses after unit propagation are estimated. Then a tree is formed which
branches on the most important literals, and the cubes produces from this.

The result of the splitting stage are "assumptions", $$\varphi_i$$, which will
be used to create the $$i$$ new subproblems, $$F \land \varphi_i$$.

#### _Solve_

Each of the subproblems are fed into a CDCL solver. The details of how these
solvers actually determine which possible DRAT clauses should be used to provide
efficient refutations of the problems is beyond my current understanding.

#### _Validate_

Importantly, all of the above steps must be validated to ensure the proof is
correct. The encoding phase is manually validated. Transforms and splitting is
able to be validated using properties of the results. We covered earlier how the
solving stage is able to be validated.

### Results

Most of the results presented aren't of interest to the non-expert, with the
obvious exception of the overall results that the Boolean Pythagorean triple
problem is solvable for $$n=7824$$, but not solvable for $$n=7825$$. The authors
do also note an additional result that I believe is interesting.

One of the criticisms of this type of proof is that it does not provide
intuition as to why the result is so. Indeed, no human could ever trawl through
the 200 TB proof. As we saw earlier, it is a headache to try and understand a
single RAT clause. However, the authors did manage to find some intuition as to
the results.

They were able to identify a _backbone_ in the proof, a variable that is
assigned the same value in all solutions. For $$n=7824$$, variables for 5180,
and 5865 were always True, whereas the variables for 625 and 7800 were always
False. However, $$5180^{2} + 5865^{2} = 625^{2} + 7800^{2} = 7825^{2}$$. So
these requirements finally conflict at $$n=7825$$.

This might not be entirely satisfying, but the authors note that it just might
be the case that this is the only explanation and there may be no
"human-readable" proof.
