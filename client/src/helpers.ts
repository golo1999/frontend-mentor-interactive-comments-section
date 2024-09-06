import { Colors } from "colors";
import { Color } from "types";

export function getColorValue(color: Color) {
  return Object.values(Colors)
    .flatMap((group) => Object.entries(group))
    .find(([key]) => key === color)?.[1]!;
}
