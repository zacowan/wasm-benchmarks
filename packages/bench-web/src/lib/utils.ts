import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import initFibRs, { fib as fibRs } from "@/benches/rs/fib/pkg";
// import { fib as fibJs } from "@/benches/js/fib";
// import initFibC from "@/benches/c/pkg";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const fetchWasm = async (
//   name: "fib.js" | "fib.c.wasm" | "fib.rs.wasm"
// ): Promise<{
//   run: () => number;
// }> => {
//   if (name === "fib.js") {
//     return {
//       run: () => fibJs(30),
//     };
//   } else if (name === "fib.rs.wasm") {
//     await initFibRs();
//     return {
//       run: () => fibRs(30),
//     };
//   }
//   // fib.c.wasm
//   const fibCModule = await initFibC();
//   return {
//     run: () => fibCModule._fib(30),
//   };
// };
