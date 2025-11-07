export function updateInputValue(
  input: HTMLInputElement,
  selectedValue: string
) {
  if (selectedValue.length === 0) {
    input.value = '';
    return;
  }

  input.value = selectedValue[0];
}

export function clearOutput(output: HTMLOutputElement) {
  return (output.textContent = '');
}

export function clearUI(
  listbox: HTMLUListElement,
  input: HTMLInputElement,
  output?: HTMLOutputElement
) {
  if (output) clearOutput(output);
  listbox.innerHTML = '';
  listbox.classList.remove('visible');
  input.setAttribute('aria-expanded', 'false');
}

export function filterValues(values: string[], query: string): string[] {
  return values.filter((value) => value.toLowerCase().startsWith(query));
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
