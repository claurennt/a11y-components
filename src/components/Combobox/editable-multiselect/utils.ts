import type { ResponseData } from '../../types';

export async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    const { data } = await response.json();
    return data as ResponseData['data'];
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export function isFetchResponse(response: any): response is ResponseData {
  return response && Array.isArray(response);
}

export function getCityAndCountryData(data: ResponseData['data']): string[] {
  return data.map((obj) => `${obj.city}, ${obj.country}`);
}

export function saveToLocalStorage(key: string, data: string[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage(key: string) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function isPreviousSelection(
  selection: string,
  selectedCities: string[]
): boolean {
  return selectedCities.includes(selection);
}

export function updateSelection(
  selection: string,
  selectedCities: string[]
): void {
  const index = selectedCities.indexOf(selection);

  if (index === -1) {
    selectedCities.push(selection);
  } else {
    selectedCities.splice(index, 1);
  }
}

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

export function updateVisualFocus(
  options: NodeListOf<HTMLLIElement>,
  focusedOption: HTMLLIElement | undefined
) {
  if (!focusedOption) return;
  // Remove focus from all
  options.forEach((option) => option.classList.remove('focused'));

  focusedOption.classList.add('focused');
  focusedOption.scrollIntoView({ block: 'nearest' });
}

export function updateInputValue(
  input: HTMLInputElement,
  selectedCities: string[]
) {
  if (selectedCities.length === 0) {
    input.value = '';
    return;
  }
  if (selectedCities.length === 1 && selectedCities[0]) {
    input.value = selectedCities[0];
    return;
  }
  input.value = `${selectedCities.length} cities selected`;
}

export function clearUI(
  listbox: HTMLUListElement,
  input: HTMLInputElement,
  output?: HTMLOutputElement
) {
  if (output) output.textContent = '';
  listbox.innerHTML = '';
  listbox.classList.remove('visible');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-activedescendant', '');
}

export function updateActiveDescendant(
  input: HTMLInputElement,
  focusedOption: HTMLLIElement | undefined
) {
  if (!focusedOption) {
    input.setAttribute('aria-activedescendant', '');
    return;
  }

  input.setAttribute('aria-activedescendant', focusedOption.id);
}

export function filterCities(cities: string[], query: string): string[] {
  return cities.filter((city) => city.toLowerCase().startsWith(query));
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
