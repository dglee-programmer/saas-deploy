import { render, screen } from '@testing-library/react';
import { Icon } from '../Icon';
import { describe, it, expect } from 'vitest';

describe('Icon Component', () => {
  it('renders correctly with given name', () => {
    render(<Icon name="add" />);
    const iconBase = screen.getByText('add');
    expect(iconBase).toBeDefined();
    expect(iconBase.classList.contains('material-symbols-outlined')).toBe(true);
  });

  it('applies filled variation correctly', () => {
    const { container } = render(<Icon name="save" filled />);
    const span = container.querySelector('span');
    expect(span?.style.fontVariationSettings).toContain("'FILL' 1");
  });

  it('applies outline variation by default', () => {
    const { container } = render(<Icon name="save" />);
    const span = container.querySelector('span');
    expect(span?.style.fontVariationSettings).toContain("'FILL' 0");
  });

  it('applies custom className correctly', () => {
    const { container } = render(<Icon name="person" className="text-primary" />);
    expect(container.querySelector('.text-primary')).toBeDefined();
  });
});
