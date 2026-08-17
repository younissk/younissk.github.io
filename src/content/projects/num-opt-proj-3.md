---
title: Lasso Optimization Algorithms
repoName: num_opt_proj_3
summary: Implements and compares forward-backward, projected gradient and active-set methods on penalized and constrained Lasso problems.
year: 2025
period: "2025"
category: research
tags: [numerical-optimization, lasso, convex-optimization, sparsity]
stack: [Python, NumPy, matplotlib, LaTeX]
status: archived
repo: https://github.com/younissk/num_opt_proj_3
demo: null
paper: null
private: false
featured: false
---

A numerical optimization study approximating `sin(x)` over `[-2π, 2π]` with a polynomial while
pushing the coefficient vector toward sparsity — the penalized Lasso solved with a proximal
forward-backward method, the constrained form solved with projected gradient, and an active-set
method as a third point of comparison.

Beyond the three solvers it looks at what actually moves convergence: polynomial degree, the λ
sensitivity sweep, the conditioning of the Vandermonde matrix, and diagonal, Cholesky and SVD
preconditioners compared side by side. Every experiment writes a plot into `results/`, and the
write-up is a LaTeX report in the repo.
