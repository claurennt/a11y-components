export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: Partial<HTMLElementTagNameMap[K]> & Record<string, any> = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  Object.entries(options).forEach(([key, value]) => {
    if (key in element) {
      (element as any)[key] = value;
    } else {
      element.setAttribute(key, String(value));
    }
  });

  return element;
}
