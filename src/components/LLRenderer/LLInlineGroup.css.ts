import { style } from "@vanilla-extract/css";
import { baseFontSize } from "../styles";

export const textStyle = style({
  selectors: {
    "&.strong": {
      fontWeight: "bold",
    },
    "&.emphasis": {
      fontStyle: "italic",
    },
  },
});
