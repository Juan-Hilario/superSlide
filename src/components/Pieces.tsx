interface Coordinate {
  m: number;
  n: number;
}

export interface Shape {
  id: number;
  type: ShapeType;
  coordinates: Coordinate[];
}

type ShapeType =
  | "horizontalRect"
  | "verticalRect"
  | "smallSquare"
  | "bigSquare";

export function createShape(
  type: ShapeType,
  m: number,
  n: number,
  id: number = 0,
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
  return { id, type, coordinates };
}

// export interface VerticalRectangle {
//   id: number;
//   type: "verticalRectangle";
//   coordinates: [Coordinate, Coordinate];
// }
// export interface HorizontalRectangle {
//   id: number;
//   type: "horizontalRectangle";
//   coordinates: [Coordinate, Coordinate];
// }
//
// export interface BigSquare {
//   id: number;
//   type: "bigSquare";
//   coordinates: [Coordinate, Coordinate, Coordinate, Coordinate];
// }
// export interface SmallSquare {
//   id: number;
//   type: "smallSquare";
//   coordinates: [Coordinate];
// }

// // n must be less than 3
// export function horizontalRect(m: number, n: number, id: number) {
//   return {
//     id: id,
//     type: "horizontalRect",
//     coordinates: [
//       {
//         m: m,
//         n: n,
//       },
//       { m: m, n: n + 1 },
//     ],
//   };
// }
//
// // m must be less than 4
// export function verticalRect(m: number, n: number, id: number) {
//   return {
//     id: id,
//     type: "verticalRect",
//     coordinates: [
//       {
//         m: m,
//         n: n,
//       },
//       { m: m + 1, n: n },
//     ],
//   };
// }
//
// // Has to be within the 5 by 4 matrix
// export function smallSquare(m: number, n: number, id: number) {
//   return {
//     id: id,
//     type: "smallSquare",
//     coordinates: [
//       {
//         m: m,
//         n: n,
//       },
//     ],
//   };
// }
//
// // m must be less than 4, n must be less than 3
// export function bigSquare(m: number, n: number) {
//   return {
//     id: 0,
//     type: "bigSquare",
//     coordinates: [
//       { m: m, n: n },
//       { m: m, n: n + 1 },
//       { m: m + 1, n: n },
//       { m: m + 1, n: n + 1 },
//     ],
//   };
// }
