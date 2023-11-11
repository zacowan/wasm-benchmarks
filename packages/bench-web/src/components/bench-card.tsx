import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface BenchCardProps {
  title: string;
  description: string;
  onRun?: () => number[];
}

const ERROR_TIMEOUT_MS = 2000; // 2s

export const BenchCard = ({ title, description, onRun }: BenchCardProps) => {
  const [results, setResults] = useState<number[]>([]); // in ms
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleRun = async () => {
    if (!onRun) {
      setError(new Error("Failed to run benchmark"));
      setTimeout(() => {
        setError(null);
      }, ERROR_TIMEOUT_MS);
      return;
    }
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const res = onRun();
        setResults(res);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    }, 250);
  };

  const getContent = () => {
    if (error) {
      return <p>Error: {error.message}</p>;
    }

    if (results.length === 0) {
      return <p>No benchmark data.</p>;
    }

    return (
      <Badge variant="secondary">
        Avg:{" "}
        {isLoading
          ? "..."
          : results.reduce<number>((acc, curr) => acc + curr, 0) /
            results.length}{" "}
        ms
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{getContent()}</CardContent>
      <CardFooter>
        <Button disabled={isLoading || !onRun} onClick={handleRun}>
          {isLoading || !onRun ? "Waiting..." : "Run Benchmark"}
        </Button>
      </CardFooter>
    </Card>
  );
};
