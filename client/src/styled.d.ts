import "styled-components";

import { TypeBackground, TypeBorder, TypeIcon, TypeText } from "types";

// Extending the DefaultTheme interface to include the theme structure
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: TypeBackground;
      border: TypeBorder;
      icon: TypeIcon;
      line: string;
      loading: string;
      text: TypeText;
    };
  }
}
