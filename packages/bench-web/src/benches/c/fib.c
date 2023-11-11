#include <stdio.h>

const int NUMBER = 30;

int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n-1) + fib(n-2);
}

int main() {
    fib(NUMBER);
    return 0;
}
