import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '@/app/components/Pagination';

describe('Pagination', () => {
  it('renders Anterior and Siguiente buttons', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
  });

  it('disables Anterior on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('Anterior')).toBeDisabled();
  });

  it('disables Siguiente on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('Siguiente')).toBeDisabled();
  });

  it('calls onPageChange with correct page when clicking a number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    await user.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('shows ellipsis when totalPages > 7', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });
});
