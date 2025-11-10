import './EditableWithListPopup.css';
import { createElement } from '../../utils';

export type EditableWithListPopupProps = {
  id: string;
  ariaControls: string;
  labelText: string;
  data: string[];
};
import { clearOutput, clearUI, debounce, filterValues } from './utils';

/* ------------------ Configuration ------------------ */
const CONFIG = {
  MIN_QUERY_LENGTH: 3,
  DEBOUNCE_DELAY: 500,
  KEYS: [
    'ArrowDown',
    'ArrowUp',
    'Enter',
    'Escape',
    'Tab',
    ' ',
    'ArrowRight',
    'ArrowLeft',
  ],
};

/* ------------------ State ------------------ */
let currentIndex = 0;

/* ------------------ Core Logic ------------------ */

function renderOptions(
  filteredValues: string[],
  listbox: HTMLUListElement,
  input: HTMLInputElement,
  output: HTMLOutputElement
) {
  clearUI(listbox, input, output);
  if (filteredValues.length === 0) {
    output.textContent = 'No results found';
    return;
  }

  filteredValues.forEach((value) => {
    const option = createElement('li', {
      role: 'option',
      textContent: value,
      tabIndex: -1,
    });

    option.addEventListener('click', (e) => {
      e.stopPropagation();
      finaliseSelection(option, input, listbox);
    });

    listbox.appendChild(option);
  });

  listbox.classList.add('visible');
  input.setAttribute('aria-expanded', 'true');
}

function finaliseSelection(
  option: HTMLLIElement,
  input: HTMLInputElement,
  listbox: HTMLUListElement
) {
  input.value = option.textContent;
  clearUI(listbox, input);
}

/* ------------------ Keyboard Navigation ------------------ */

function handleListboxKeyboardNavigation(
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

    case 'ArrowRight':
    case 'ArrowLeft':
      e.preventDefault();
      input.focus();
      break;

    case 'Enter':
    case ' ':
      e.preventDefault();
      const option = options[currentIndex];
      if (!option) return;
      finaliseSelection(option, input, listbox);
      input.focus();
      return;

    case 'Escape':
    case 'Tab':
      clearUI(listbox, input);
      input.focus();
      return;
  }

  if (focusedOption) {
    focusedOption.focus();
  }
}

function focusFirstOption(e: KeyboardEvent, listbox: HTMLUListElement) {
  const firstOption = listbox.querySelector('[role="option"]') as HTMLLIElement;
  if (e.key !== 'ArrowDown' || !firstOption) return;

  firstOption.focus();
}
/* ------------------ Event Handlers ------------------ */

function handleInput(
  listbox: HTMLUListElement,
  output: HTMLOutputElement,
  input: HTMLInputElement,
  data: string[]
) {
  const query = (input.value || '').toLowerCase().trim();

  if (query.length < CONFIG.MIN_QUERY_LENGTH) {
    clearUI(listbox, input, output);
    return;
  }

  const filtered = filterValues(data, query);
  renderOptions(filtered, listbox, input, output);
}

const debouncedHandleInput = debounce(handleInput, CONFIG.DEBOUNCE_DELAY);

/* ------------------ Init Component ------------------ */

export const createEditableMultiselect = ({
  id,
  ariaControls,
  labelText = 'Enter city',
  data,
}: EditableWithListPopupProps) => {
  const wrapper = createElement('div', {
    className: 'editable-listpopup-wrapper',
  });
  const label = createElement('label', {
    for: id,
    textContent: labelText,
  });
  const input = createElement('input', {
    id,
    role: 'combobox',
    'aria-controls': ariaControls,
    'aria-expanded': 'false',
  });
  const listbox = createElement('ul', {
    role: 'listbox',
    id: ariaControls,
  });
  const output = createElement('output', {
    id: `${id}-no-results`,
    ariaRelevant: 'additions',
    role: 'status', // polyfill for Safari that does not announce the live region
  });

  input.addEventListener('input', () => {
    debouncedHandleInput(listbox, output, input, data);
  });
  input.addEventListener('keydown', (e) => {
    clearOutput(output);
    focusFirstOption(e, listbox);
  });
  listbox.addEventListener('keydown', (e) =>
    handleListboxKeyboardNavigation(e, listbox, input)
  );

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(output);
  wrapper.appendChild(listbox);

  return wrapper;
};
