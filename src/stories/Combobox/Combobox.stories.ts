import type { Meta, StoryObj } from '@storybook/html-vite';

import {
  createEditableMultiselect,
  type EditableWithListPopupProps,
} from './editable-with-list-popup/EditableWithListPopup';

const data = [
  'Berlin, Germany',
  'Bangkok, Thailand',
  'Cairo, Egypt',
  'Riccione, Italy',
  'Catania, Italy',
];

const meta = {
  title: 'Example/Combobox/EditableWithListPopup',
  render: (args) => createEditableMultiselect(args),
} satisfies Meta<EditableWithListPopupProps>;

export default meta;

export const EditableWithListPopup: StoryObj = {
  args: {
    id: 'editable-combobox',
    ariaControls: 'cities-listbox',
    labelText: 'Select a city',
    data,
  },
};
