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
  onRun: () => Promise<number[]>;
  isLoading?: boolean;
}

export const BenchCard = ({
  title,
  description,
  onRun,
  isLoading: isLoadingProp = false,
}: BenchCardProps) => {
  const [results, setResults] = useState<number[]>([]); // in ms
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const res = await onRun();
      setResults(res);
      setIsLoading(false);
    }, 250);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p>No benchmark data.</p>
        ) : (
          <Badge variant="secondary">
            Avg:{" "}
            {isLoading
              ? "..."
              : results.reduce<number>((acc, curr) => acc + curr, 0) /
                results.length}{" "}
            ms
          </Badge>
        )}
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading || isLoadingProp} onClick={handleRun}>
          {isLoading || isLoadingProp ? "Waiting..." : "Run Benchmark"}
        </Button>
      </CardFooter>
    </Card>
  );
};
