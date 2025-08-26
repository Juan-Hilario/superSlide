interface Coordinate {
  m: number;
  n: number;
}

export interface Shape {
  id: number;
  type: ShapeType;
  origin: Coordinate;
  coordinates: Coordinate[];
}

export type ShapeType =
  | "horizontalRect"
  | "verticalRect"
  | "smallSquare"
  | "bigSquare";

export function createShape(
  type: ShapeType,
  m: number,
  n: number,
  id: number = 0,
  origin: Coordinate = { m: m, n: n },
): Shape {
  let coordinates: Coordinate[];

  switch (type) {
    case "horizontalRect":
      coordinates = [
        { m: m, n: n },
        { m: m, n: n + 1 },
      ];
      break;
    case "verticalRect":
      coordinates = [
        {
          m: m,
          n: n,
        },
        { m: m + 1, n: n },
      ];
      break;
    case "bigSquare":
      coordinates = [
        { m: m, n: n },
        { m: m, n: n + 1 },
        { m: m + 1, n: n },
        { m: m + 1, n: n + 1 },
      ];
      break;
    case "smallSquare":
      coordinates = [{ m: m, n: n }];
      break;
    default:
      throw new Error(`Unknown Shape Type: ${type}`);
  }
  return { id, type, origin, coordinates };
}
