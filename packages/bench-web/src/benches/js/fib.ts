const _fib = (n: number): number => {
  if (n <= 1) {
    return n;
  }

  return _fib(n - 1) + _fib(n - 2);
};

export const fib = () => _fib(30);
