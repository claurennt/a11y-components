import type { Meta, StoryObj } from '@storybook/html-vite';

import {
  createEditableMultiselect,
  type EditableWithListPopupProps,
} from './editable-with-list-popup/EditableWithListPopup';

const meta = {
  title: 'Example/Combobox/EditableWithListPopup',
  render: (args) => createEditableMultiselect(args),

  args: {
    id: 'editable-combobox',
    ariaControls: 'cities-listbox',
    labelText: 'Select a city',
    data: [],
  },
} satisfies Meta<EditableWithListPopupProps>;

export default meta;

export const EditableWithListPopup: StoryObj = {
  args: {
    id: 'editable-combobox',
    ariaControls: 'cities-listbox',
    labelText: 'Select a city',
    data: [],
  },
};
