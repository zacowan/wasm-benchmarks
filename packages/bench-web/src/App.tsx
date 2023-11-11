import { useQuery } from "react-query";
import { fetchWasm } from "./lib/utils";
import { BenchCard } from "@/components/bench-card";

const FIB_30_RESULT = 832040;

const runFib = (f: () => number) => {
  const resultsMs = [];
  for (let i = 0; i < 1000; i++) {
    const startTime = Date.now();
    const res = f();
    const endTime = Date.now();
    if (res !== FIB_30_RESULT) {
      throw new Error(
        `Incorrect result. Expected ${FIB_30_RESULT}, received ${res}.`
      );
    }
    resultsMs.push(endTime - startTime);
  }
  return resultsMs;
};

const App = () => {
  const { data: fibJsModule } = useQuery(
    "fib.js",
    async () => await fetchWasm("fib.js")
  );
  const { data: fibCModule } = useQuery(
    "fib.c",
    async () => await fetchWasm("fib.c.wasm")
  );
  const { data: fibRsModule } = useQuery(
    "fib.rs",
    async () => await fetchWasm("fib.rs.wasm")
  );

  return (
    <div className="bg-background text-foreground">
      <nav className="border-b border-slate-300 dark:border-slate-700 px-16 py-4">
        <ul>
          <li>
            <a href="/">WASM Benchmarks</a>
          </li>
        </ul>
      </nav>
      <main className="py-8 container">
        <section className="space-y-8">
          <h1 className="text-4xl font-medium">Benchmarks</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BenchCard
              title="fib.js"
              description="fib(30), executed 1,000 times."
              onRun={fibJsModule ? () => runFib(fibJsModule?.run) : undefined}
            />
            <BenchCard
              title="fib.c"
              description="fib(30), executed 1,000 times."
              onRun={fibCModule ? () => runFib(fibCModule?.run) : undefined}
            />
            <BenchCard
              title="fib.rs"
              description="fib(30), executed 1,000 times."
              onRun={fibRsModule ? () => runFib(fibRsModule?.run) : undefined}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
