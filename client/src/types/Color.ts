import { Colors } from "colors";

type NestedKeys<T> = {
  [K in keyof T]: T[K] extends object ? keyof T[K] : never;
}[keyof T];

export type Color = NestedKeys<typeof Colors>;
