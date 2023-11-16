import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  OutgoingMessage,
  RunResults as BenchResults,
  IncomingInitMessage,
  IncomingRunMessage,
} from "./lib/fib-worker/utils";
import { BenchCard } from "./components/bench-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FibWorker from "@/lib/fib-worker/fib-worker?worker";

const App = () => {
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [benchResults, setBenchResults] = useState<BenchResults | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const [fibNumber, setFibNumber] = useState(25);

  const fibWorker: Worker = useMemo(() => new FibWorker(), []);

  const handleWorkerMessage = useCallback(
    (event: MessageEvent<OutgoingMessage>) => {
      if (event.data.type === "init") {
        if (event.data.error === null) {
          setIsWorkerReady(true);
        } else {
          console.error("Error loading worker", event.data.error);
        }
      } else {
        // type === 'run'
        setIsRunning(false);
        if (event.data.error === null) {
          setBenchResults(event.data.results);
        } else {
          setError(event.data.error);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (window.Worker) {
      fibWorker.onmessage = handleWorkerMessage;
      const initMsg: IncomingInitMessage = {
        type: "init",
      };
      fibWorker.postMessage(initMsg);
    }
  }, [fibWorker, handleWorkerMessage]);

  const runBenchmark = () => {
    setIsRunning(true);
    const runMsg: IncomingRunMessage = {
      type: "run",
      fibNumber,
    };
    fibWorker.postMessage(runMsg);
  };

  return (
    <div className="bg-background text-foreground">
      <nav className="border-b border-slate-300 dark:border-slate-700 px-16 py-4">
        <ul>
          <li>
            <a href="/">WASM Benchmarks</a>
          </li>
        </ul>
      </nav>
      <main className="py-8 container space-y-8">
        <h1 className="text-4xl font-medium">Benchmarks</h1>
        <section className="space-y-8">
          <h2 className="text-2xl">Fib Benchmark</h2>
          <div>
            <Label className="block mb-2" htmlFor="fib-num">
              Fibonacci Number to Calculate
            </Label>
            <Select
              value={fibNumber.toString()}
              onValueChange={(val) => setFibNumber(parseInt(val, 10))}
            >
              <SelectTrigger id="fib-num" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="35">35</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button disabled={!isWorkerReady || isRunning} onClick={runBenchmark}>
            {isWorkerReady
              ? isRunning
                ? "Running benchmark..."
                : "Run Benchmark"
              : "Waiting for worker..."}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BenchCard
              title="fib.js"
              sourceCode=""
              results={benchResults?.js}
            />
            <BenchCard title="fib.c" sourceCode="" results={benchResults?.c} />
            <BenchCard
              title="fib.rs"
              sourceCode=""
              results={benchResults?.rs}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
