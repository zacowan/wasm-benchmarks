export type EventTypes = "init" | "run";

export interface OutgoingInitMessage {
  type: "init";
  error: Error | null;
}

type RunTimeMs = number;

export interface RunResults {
  js: RunTimeMs[];
  c: RunTimeMs[];
  rs: RunTimeMs[];
}

export interface OutgoingRunMessage {
  type: "run";
  results: RunResults;
  error: Error | null;
}

export type OutgoingMessage = OutgoingInitMessage | OutgoingRunMessage;

export interface IncomingInitMessage {
  type: "init";
}

export interface IncomingRunMessage {
  type: "run";
  fibNumber: number;
}

export type IncomingMessage = IncomingInitMessage | IncomingRunMessage;
