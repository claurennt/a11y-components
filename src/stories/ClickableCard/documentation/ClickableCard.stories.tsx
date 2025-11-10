import type { Meta, StoryObj } from '@storybook/html-vite';

import { createClickableCard, type ClickableCardProps } from '..';

const meta = {
  title: 'Example/ClickableCard',
  render: (args) => createClickableCard(args),
} satisfies Meta<ClickableCardProps>;

export default meta;

const title = "Hello! I'm Claudia";
const description =
  "I'm a developer passionate about web accessibility. I love creating products that everyone can use.";
const href = 'https://www.github.com/claurennt';
const UIelements = [
  { tag: 'a', options: { textContent: 'Contact me', href: 'href' } },
  {
    tag: 'a',
    options: {
      textContent: 'LinkedIn (opens new window)',
      href: 'https://www.linkedin.com/in/hello-world-claudia-here/',
      target: '_blank',
    },
  },
];

export const ClickableCard: StoryObj = {
  args: { title, description, href, UIelements },
};
