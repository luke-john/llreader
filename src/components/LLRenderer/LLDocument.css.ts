import { style } from "@vanilla-extract/css";
import { baseFontSize } from "../styles";

export const heading = style({
  fontSize: `${24 / baseFontSize}rem`,
  fontWeight: "bold",
  margin: 0,
  selectors: {
    "&.tag-translation": {
      marginTop: "1.5rem",
    },
  },
});

export const paragraph = style({
  fontSize: "1rem",
  lineHeight: 2.5,
  margin: 0,
  padding: 0,
  selectors: {
    "&.tag-translation": {
      marginTop: "1.1rem",
    },
  },
});
