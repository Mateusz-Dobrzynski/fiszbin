---
tags: [IT]
---
# Time Complexity
- Time complexity is an estimated time taken for running an algorithm
- It is usually calculated by counting the predicted amount of elementary operations which will be performed. Assumption here is that every operation takes a fixed amount of time to perform
- Time complexity is represented with [[Big O notation]]

![[Time Complexity Comparison.svg|Time Complexity Comparison]]
## Exemplary time complexities
From the least to the most complex ones:
### $O(1)$
In this case algorithm takes the same time to complete.  It is usually considered the best solution.
### $O(\log _2 n)$
Code implementation:
```C++
for (i = 1; i < n; i *= 2) {
	//statement
}
```
### $O(\sqrt n)$
```C++
for (i = 1; p <= n; i++) {
	p = p + 1;
}
```

```C++
for (i = 0; i * i < n; i++) {
	//statement
}
```
### $O(n)$
Code implementation:
```C++
for (i = 0; i < n; i++) {
	//statement
}
```
### $O(n^2)$
Code implementation:
```C++
for (i = 0; i < n; i++) {
	for (j = 0; j < n; j++) {
		//statement
	}
}
```
### $O(2^n)$
### $O(n!)$