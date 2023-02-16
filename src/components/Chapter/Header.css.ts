import { style } from "@vanilla-extract/css";
import { baseFontSize } from "../styles";

export const chapterHeading = style({
  fontSize: `${16 / baseFontSize}rem`,
  fontWeight: "normal",
  margin: `0`,
});
