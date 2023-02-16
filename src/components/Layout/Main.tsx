import { main as mainStyle } from "./Main.css";

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className={mainStyle}>
      {children}
    </main>
  );
}
