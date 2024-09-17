---
tags: [IT]
---
# Big O Notation
- Notation used to represent how [[time complexity]] grows with the increasing amount of input data
- It represents this factor (variable) of a function, which ==grows the fastest==

## Examples of finding the Big O
### 1.
$$
f(n) = {n^2 + n}
$$
To find the Big O, we check, which factor grows the fastest. In this function we have only two factors: $n^2$ and $n$. Therefore:

| $n$ | $n^2$ |
|: --- :|: ----- :|
| 1   | 1     |
| 2   | 4     |
| 3   | 9     |
| 4   | 16    |
| ... | ...      |


In this example $n^2$ grows the fastest, therefore big O looks like this:
$$
O(n^2)
$$
### 2.
$$
f(n) = {n\over 2}
$$
The only variable in this example is $n$, therefore the Big O is:
$$
O(n)
$$