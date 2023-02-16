export const baseFontSize = 16;

export function cx(...args: (string | undefined)[]) {
  return args.filter(Boolean).join(" ");
}
