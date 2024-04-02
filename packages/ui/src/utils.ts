export function isLeftClick(e: MouseEvent) {
  return e.button === 0 && !e.ctrlKey;
}
