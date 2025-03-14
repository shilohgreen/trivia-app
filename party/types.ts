// Define the valid colors as a union type
export type ValidColor = 'pink' | 'red' | 'purple' | 'green' | 'blue';

// Dictionary mapping colors to numbers
export type ColorDictionary = Record<ValidColor, number>;

// Array that only accepts valid colors
export type ColorArray = ValidColor[];

// Example usage:
// const colorCounts: ColorDictionary = {
//   pink: 5,
//   red: 10,
//   purple: 3,
//   green: 7,
//   blue: 12
// };
// 
// const selectedColors: ColorArray = ['pink', 'blue', 'green']; 