---
tags: [IT]
aliases: [RPN, Postfix Notation]
---
# Reverse [[Polish Notation|Polish Notation]]
## Arithmetic Expression Evaluation
- Computers don't understand [[infix notation]]
- Thus in IT we use [[Polish Notation]]
- RPN is the reversed [[Polish Notation|PN]] notation
- In RPN the operands are at the end. Parentheses aren't required either
- RPN is more popular than [[Polish Notation|PN]] since it doesn't require you to read the expression "backwards"
$$ AB+ $$
## Procedure of RPN
1. Convert the expression into RPN
2. Push the opreands into the [[Stack]] in order they appear
3. When an operator is pushed, pop the two topmost operands and execute the operation 
4. Push the result into the [[Stack]]
5. The final result remains on the top of the [[Stack]]
## Genesis of the [[Polish Notation|Polish notation]] name
- [[Polish Notation|PN]] was created by a Polish logician Jan Łukasiewicz in 1924
## RPN implementation in [[Encyklopedia/Python]]
[[Postfix Notation Evaluation.py]]
```Python
def isOperand(character):
    return character.isdigit()

def evaluate(expression):
    stack = []
    for character in expression:
        if isOperand(character):
            stack.append(float(character))
        else:
            if character == "+":
                operand1 = stack.pop()
                operand2 = stack.pop()
                stack.append(operand2 + operand1)
            elif character == "-":
                operand1 = stack.pop()
                operand2 = stack.pop()
                stack.append(operand2 - operand1)
            elif character == "*":
                operand1 = stack.pop()
                operand2 = stack.pop()
                stack.append(operand2 * operand1)
            elif character == "/":
                operand1 = stack.pop()
                operand2 = stack.pop()
                stack.append(operand2 / operand1)
            elif character == "^":
                operand1 = stack.pop()
                operand2 = stack.pop()
                stack.append(pow(operand2, operand1))
        print(character + " " + str(stack))
    return stack.pop()

expression = input("Insert a Postfix Expression\n")
print(evaluate(expression))

Input:
342*15-23^^/+

Output:
3 [3.0]
4 [3.0, 4.0]
2 [3.0, 4.0, 2.0]
* [3.0, 8.0]
1 [3.0, 8.0, 1.0]
5 [3.0, 8.0, 1.0, 5.0]
- [3.0, 8.0, -4.0]
2 [3.0, 8.0, -4.0, 2.0]
3 [3.0, 8.0, -4.0, 2.0, 3.0]
^ [3.0, 8.0, -4.0, 8.0]
^ [3.0, 8.0, 65536.0]
/ [3.0, 0.0001220703125]
+ [3.0001220703125]
3.0001220703125
```

---
Presentation regarding the topic: [[T1. Reverse Polish Notation.pdf]]