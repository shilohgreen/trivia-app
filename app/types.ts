export interface scoreRequestBody {
    isIncrease: boolean;
    teamColour: string;
  }

  // Define the valid colors as a union type
export type ValidColor = 'pink' | 'red' | 'purple' | 'green' | 'blue';

// Dictionary mapping colors to numbers
export type ColorDictionary = Record<ValidColor, number>;

// Array that only accepts valid colors
export type ColorArray = ValidColor[];