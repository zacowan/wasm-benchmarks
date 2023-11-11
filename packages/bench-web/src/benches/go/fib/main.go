package main

import "fmt"

const number = 30

func fib(n int) int {
	if (n <= 1) {
		return n
	}

	return fib(n - 1) + fib(n - 2)
}

func main() {
	res := fib(number)
	fmt.Println(res)
}
