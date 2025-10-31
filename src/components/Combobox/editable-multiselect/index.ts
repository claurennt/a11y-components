import {
  fetchData,
  getFromLocalStorage,
  saveToLocalStorage,
  isFetchResponse,
  getCityAndCountryData,
  isPreviousSelection,
  updateSelection,
  createElement,
  updateVisualFocus,
  updateInputValue,
  clearUI,
  updateActiveDescendant,
  debounce,
  filterCities,
} from './utils.js';

/* ------------------ Configuration ------------------ */
const CONFIG = {
  API_URL: 'https://countriesnow.space/api/v0.1/countries/population/cities',
  MIN_QUERY_LENGTH: 3,
  DEBOUNCE_DELAY: 500,
  KEYS: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab', ' '], // Spacebar represented as ' '
};

/* ------------------ State ------------------ */
let citiesData: string[] = [];
let selectedCities: string[] = [];
let currentIndex = -1;

/* ------------------ Core Logic ------------------ */

async function loadCitiesData(): Promise<string[]> {
  const cached = getFromLocalStorage('citiesData');
  if (cached) return cached;

  try {
    const response = await fetchData(CONFIG.API_URL);
    if (!isFetchResponse(response)) throw new Error('Invalid API format');

    const parsed = getCityAndCountryData(response);
    saveToLocalStorage('citiesData', parsed);
    return parsed;
  } catch (err) {
    console.error('Failed to fetch cities:', err);
    return [];
  }
}

function renderCityOptions(
  filteredCities: string[],
  listbox: HTMLUListElement,
  selectedCities: string[],
  input: HTMLInputElement,
  output: HTMLOutputElement
) {
  clearUI(listbox, input, output);

  if (filteredCities.length === 0) {
    output.textContent = 'No results found';
    return;
  }

  filteredCities.forEach((city, index) => {
    const option = createElement('li', {
      role: 'option',
      id: `option-${index}`,
      ariaChecked: 'false',
      textContent: city,
    });

    if (isPreviousSelection(city, selectedCities)) {
      option.classList.add('checked');
    }

    option.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSelection(option, city, input);
    });

    listbox.appendChild(option);
  });

  listbox.classList.add('visible');
  input.setAttribute('aria-expanded', 'true');
}

function toggleSelection(
  option: HTMLLIElement,
  city: string,
  input: HTMLInputElement
) {
  option.classList.toggle('checked');
  const isSelected = option.classList.contains('checked');
  option.setAttribute('aria-selected', isSelected.toString());

  updateSelection(city, selectedCities);
  updateInputValue(input, selectedCities);
}

/* ------------------ Keyboard Navigation ------------------ */

function handleKeyboardNavigation(
  e: KeyboardEvent,
  listbox: HTMLUListElement,
  input: HTMLInputElement
) {
  if (!CONFIG.KEYS.includes(e.key)) return;

  const options = listbox.querySelectorAll(
    '[role="option"]'
  ) as NodeListOf<HTMLLIElement>;
  if (options.length === 0) return;

  let focusedOption: HTMLLIElement | undefined = undefined;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      currentIndex = (currentIndex + 1) % options.length;
      focusedOption = options[currentIndex];
      break;

    case 'ArrowUp':
      e.preventDefault();
      currentIndex = (currentIndex - 1 + options.length) % options.length;
      focusedOption = options[currentIndex];
      break;

    case 'Enter':
    case ' ':
      e.preventDefault();
      const option = options[currentIndex];
      if (!option) return;
      toggleSelection(option, option.textContent || '', input);
      return;

    case 'Escape':
    case 'Tab':
      clearUI(listbox, input);
      return;
  }

  updateVisualFocus(options, focusedOption);
  updateActiveDescendant(input, focusedOption);
}

/* ------------------ Event Handlers ------------------ */

async function handleFocus() {
  if (citiesData.length === 0) {
    citiesData = await loadCitiesData();
  }
}

function handleInput(
  listbox: HTMLUListElement,
  output: HTMLOutputElement,
  input: HTMLInputElement
) {
  const query = (input.value || '').toLowerCase().trim();

  if (query.length < CONFIG.MIN_QUERY_LENGTH) {
    clearUI(listbox, input, output);
    return;
  }

  const filtered = filterCities(citiesData, query);
  renderCityOptions(filtered, listbox, selectedCities, input, output);
}

const debouncedHandleInput = debounce(handleInput, CONFIG.DEBOUNCE_DELAY);

/* ------------------ Init ------------------ */
export function initEditableMultiselectCombobox() {
  const input = document.querySelector<HTMLInputElement>('#editable-combobox');
  const listbox = document.querySelector<HTMLUListElement>('#cities-listbox');
  const output = document.querySelector<HTMLOutputElement>('#no-results');

  if (!input || !listbox || !output) return;

  input.addEventListener('focus', handleFocus);
  input.addEventListener('input', () =>
    debouncedHandleInput(listbox, output, input)
  );
  input.addEventListener('keydown', (e) =>
    handleKeyboardNavigation(e, listbox, input)
  );
}
