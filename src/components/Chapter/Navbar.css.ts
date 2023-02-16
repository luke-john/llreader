import { style } from "@vanilla-extract/css";
import { baseFontSize } from "../styles";

export const navbarStyles = style({
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
});

export const linkStyles = style({
  padding: "0.5rem",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "white",
  color: "black",
  textDecoration: "none",
  transition: "background-color 0.3s ease, color 0.3s ease",

  ":hover": {
    backgroundColor: "black",
    color: "white",
  },
});
