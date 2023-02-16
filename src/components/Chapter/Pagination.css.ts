import { style } from "@vanilla-extract/css";
import { baseFontSize } from "../styles";

export const paginationBarStyles = style({
  width: "100%",
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
});

export const linkStyles = style({
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid black",
  backgroundColor: "white",
  textDecoration: "none",
  color: "#000",
  transition: "background-color 0.3s ease, color 0.3s ease",

  ":hover": {
    backgroundColor: "#000",
    color: "#fff",
  },
});
