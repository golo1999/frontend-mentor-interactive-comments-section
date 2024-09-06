export type TypeIcon = {
  error: string;
  primary: TypeIconState;
  secondary: TypeIconState;
  tertiary: TypeIconState;
};

interface TypeIconState {
  default: string;
  hover: string;
}
