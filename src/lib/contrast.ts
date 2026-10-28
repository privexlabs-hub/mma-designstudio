/* WCAG 2.x relative luminance and contrast ratio. */
const lin = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
export function luminance(hex: string): number {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** AAA ≥7, AA ≥4.5 (normal text), AA Large ≥3 (≥24px or ≥18.66px bold), otherwise fail. */
export function grade(ratio: number): 'AAA' | 'AA' | 'AA Large' | 'Fail' {
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail';
}
