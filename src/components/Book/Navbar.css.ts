import { style } from "@vanilla-extract/css";
import { baseFontSize } from "../styles";

export const navbarStyles = style({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "1rem",

  padding: "0 0.5rem",
  width: "100%",
  maxWidth: "31.5rem",
  margin: "3rem auto 0",
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
