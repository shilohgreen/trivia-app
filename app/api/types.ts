export interface scoreRequestBody {
  isIncrease: boolean;
  teamColour: "pink" | "green" | "purple" | "red" | "blue";
}
export const TeamColours = ["pink", "green", "purple", "red", "blue"] as const;
