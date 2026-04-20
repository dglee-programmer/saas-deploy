import { render, screen } from '@testing-library/react';
import { Button } from '../Button';
import { describe, it, expect, vi } from 'vitest';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeDefined();
  });

  it('renders as a button by default', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
  });

  it('renders as a link when href is provided', () => {
    const { container } = render(<Button href="/dashboard">Go Home</Button>);
    const link = container.querySelector('a');
    expect(link).toBeDefined();
    expect(link?.getAttribute('href')).toBe('/dashboard');
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = render(<Button isLoading>Loading Button</Button>);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeDefined();
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('renders icons when provided', () => {
    const { container } = render(<Button leftIcon="add">With Icon</Button>);
    const icon = container.querySelector('span.material-symbols-outlined');
    expect(icon).toBeDefined();
    expect(icon?.textContent).toBe('add');
  });
});
