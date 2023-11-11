use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fib(n: i32) -> i32 {
    if n <= 1 {
        return n
    }
    fib(n - 1) + fib(n - 2)
}
