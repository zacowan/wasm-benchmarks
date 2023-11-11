import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchWasm = async (
  name: "fib.c.wasm" | "fib.go.wasm"
): Promise<{
  run: () => unknown;
}> => {
  const res = await fetch(`/wasm/${name}`);
  const bytes = await res.arrayBuffer();
  if (name === "fib.go.wasm") {
    // @ts-expect-error -- provided by public/go_wasm_exec.js script
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const go = new Go() as any;
    const results = await WebAssembly.instantiate(bytes, go.importObject);
    return {
      run: () => go.run(results.instance),
    };
  } else {
    // fib.c.wasm
    const importObject = {
      env: {},
      wasi_snapshot_preview1: {},
    };
    const results = await WebAssembly.instantiate(bytes, importObject);
    return {
      // @ts-expect-error -- not typed
      run: () => results.instance.exports.main(),
    };
  }
};
