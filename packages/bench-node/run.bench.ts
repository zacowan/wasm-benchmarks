import { bench, describe } from "vitest";
import { execa } from "execa";
import path from "path";

const WASMTIME = "wasmtime";
const NODE = "node";

type Test = "fib";
type Lang = "go" | "js";

const execWasm = (test: Test, lang: Lang) =>
  execa(WASMTIME, [path.resolve("dist", test, `${lang}.wasm`)]);

describe("fib(30)", () => {
  bench("js.wasm", async () => {
    await execWasm("fib", "js");
  });

  bench("go.wasm", async () => {
    await execWasm("fib", "go");
  });
});
