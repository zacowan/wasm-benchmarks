package main

const number = 42

func fib(n int) int {
	if (n <= 1) {
		return n
	}

	return fib(n - 1) + fib(n - 2)
}

func main() {
	fib(number)
}
