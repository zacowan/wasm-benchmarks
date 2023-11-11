import { fib } from "@/benches/js/fib";
import { useQuery } from "react-query";
import { fetchWasm } from "./lib/utils";
import { BenchCard } from "@/components/bench-card";

const runFib = async (f: () => unknown) => {
  const resultsMs = [];
  for (let i = 0; i < 1000; i++) {
    const startTime = Date.now();
    await f();
    const endTime = Date.now();
    resultsMs.push(endTime - startTime);
  }
  return resultsMs;
};

const App = () => {
  const { data: fibCModule } = useQuery(
    "fib.c",
    async () => await fetchWasm("fib.c.wasm")
  );
  const { data: fibGoModule } = useQuery(
    "fib.go",
    async () => await fetchWasm("fib.go.wasm")
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
              onRun={async () => runFib(fib)}
            />
            <BenchCard
              title="fib.c"
              description="fib(30), executed 1,000 times."
              // @ts-expect-error -- yeah
              onRun={async () => runFib(fibCModule?.run)}
              isLoading={fibCModule === undefined}
            />
            <BenchCard
              title="fib.go"
              description="fib(30), executed 1,000 times."
              // @ts-expect-error -- yeah
              onRun={async () => runFib(fibGoModule?.run)}
              isLoading={fibGoModule === undefined}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
