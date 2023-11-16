import initFibRs, { fib as fibRs } from "../../benches/rs/fib/pkg";
import { fib as fibJs } from "../../benches/js/fib";
import initFibC from "../../benches/c/pkg";
import {
  OutgoingInitMessage,
  OutgoingRunMessage,
  RunResults,
  IncomingMessage,
} from "./utils";

let isInitialized = false;

const FIBS: {
  [name: string]: (n: number) => unknown;
} = {
  js: fibJs,
  c: () => new Error("fib.c is not defined"),
  rs: () => new Error("fib.rs is not defined"),
};

const runBenchmark = (fn: (n: number) => number, fibNumber: number) => {
  const resultsMs = [];
  for (let i = 0; i < 100; i++) {
    const iStringified = i.toString();
    performance.mark(iStringified);

    fn(fibNumber);

    const measurement = performance.measure(iStringified, iStringified);
    resultsMs.push(measurement.duration);
  }
  return resultsMs;
};

self.onmessage = async (e: MessageEvent<IncomingMessage>) => {
  if (e.data.type === "init") {
    // initialize wasm modules
    if (isInitialized) {
      return;
    }

    try {
      await initFibRs();
      FIBS.rs = fibRs;

      const fibCModule = await initFibC();
      FIBS.c = fibCModule._fib;

      const msg: OutgoingInitMessage = {
        type: "init",
        error: null,
      };
      self.postMessage(msg);

      isInitialized = true;
    } catch (error) {
      const msg: OutgoingInitMessage = {
        type: "init",
        error: error as Error,
      };
      self.postMessage(msg);
    }
  } else if (e.data.type === "run") {
    const results: RunResults = {
      js: [],
      c: [],
      rs: [],
    };

    try {
      results.rs = runBenchmark(
        FIBS.rs as (n: number) => number,
        e.data.fibNumber
      );
      results.js = runBenchmark(
        FIBS.js as (n: number) => number,
        e.data.fibNumber
      );
      results.c = runBenchmark(
        FIBS.c as (n: number) => number,
        e.data.fibNumber
      );

      const msg: OutgoingRunMessage = {
        type: "run",
        results: results,
        error: null,
      };
      self.postMessage(msg);
    } catch (error) {
      const msg: OutgoingRunMessage = {
        type: "run",
        results: results,
        error: error as Error,
      };
      self.postMessage(msg);
    }
  }
};
