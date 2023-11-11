export type Module = {
  _fib: (n: number) => number;
};

export default function initModule(): Promise<Module>;
