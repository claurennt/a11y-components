import './style.css';
import { createElement, type ElementDefinition } from '../utils';

export type ClickableCardProps = {
  title: string;
  href: string;
  description?: string;
  UIelements?: ElementDefinition[];
};

export function createClickableCard({
  title,
  description,
  href,
  UIelements,
}: ClickableCardProps): HTMLElement {
  const card = createElement('article', { className: 'clickable-card' });

  const cardTitle = createElement('a', {
    href,
    textContent: title,
    className: 'title',
  });
  const titleHeading = createElement('h2');
  titleHeading.appendChild(cardTitle);

  const cardContent = createElement('p', {
    textContent: description,
    className: 'description',
  });

  card.appendChild(titleHeading);
  card.appendChild(cardContent);

  const UIelementsWrapper = createElement('div', {
    className: 'UI-elements-wrapper',
  });
  UIelements?.forEach(({ tag, options }) => {
    const el = createElement(tag, { ...options, 'z-Index': 100 });
    UIelementsWrapper.appendChild(el);
  });

  card.appendChild(UIelementsWrapper);

  return card;
}
