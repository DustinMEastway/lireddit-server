export type PatternsError<KeysT extends string> = {
  patterns: Partial<Record<KeysT, RegExp>>;
  value: string;
};
