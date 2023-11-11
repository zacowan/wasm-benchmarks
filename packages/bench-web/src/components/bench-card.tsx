import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import percentile from "percentile";

interface BenchCardProps {
  title: string;
  sourceCode: string;
  results?: number[];
}

export const BenchCard = ({ title, sourceCode, results }: BenchCardProps) => {
  const resultsData = useMemo(() => {
    if (results === undefined) {
      return undefined;
    }
    return [
      {
        label: "mean",
        data:
          results.reduce<number>((acc, curr) => acc + curr, 0) / results.length,
      },
      { label: "min", data: Math.min(...results) },
      { label: "max", data: Math.max(...results) },
      { label: "p75", data: percentile(75, results) as number },
      { label: "p95", data: percentile(95, results) as number },
      { label: "p99", data: percentile(99, results) as number },
    ];
  }, [results]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!resultsData ? (
          <p>No benchmark data.</p>
        ) : (
          <span className="flex flex-wrap gap-2">
            {resultsData.map(({ label, data }) => (
              <Badge key={label} variant="secondary">
                {label}:{" "}
                {Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(data)}{" "}
                ms
              </Badge>
            ))}
          </span>
        )}
      </CardContent>
      <CardFooter>{sourceCode}</CardFooter>
    </Card>
  );
};
