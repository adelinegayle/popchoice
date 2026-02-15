import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/page';

global.fetch = jest.fn();

describe('Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main heading', () => {
    render(<Page />);
    expect(screen.getByText('PopChoice')).toBeInTheDocument();
    expect(screen.getByText('Simple movie recommender')).toBeInTheDocument();
  });

  it('renders the form with all inputs', () => {
    render(<Page />);
    expect(screen.getByLabelText(/Favourite movie/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Era/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vibe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Recommend a movie/i })).toBeInTheDocument();
  });

  it('shows initial empty state message', () => {
    render(<Page />);
    expect(screen.getByText('Fill the form and click recommend.')).toBeInTheDocument();
  });

  it('updates form state when user types', () => {
    render(<Page />);
    const input = screen.getByLabelText(/Favourite movie/i) as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: 'Inception' } });
    expect(input.value).toBe('Inception');
  });

  it('updates era when user selects an option', () => {
    render(<Page />);
    const select = screen.getByLabelText(/Era/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'MODERN' } });
    expect(select.value).toBe('MODERN');
  });

  it('shows loading state when submitting', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    render(<Page />);
    const button = screen.getByRole('button', { name: /Recommend a movie/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Finding the perfect movie...')).toBeInTheDocument();
    });
  });

  it('displays recommendation on successful API call', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        recommendation: 'Title: Inception (2010)\nWhy: Great movie!',
      }),
    });

    render(<Page />);
    const button = screen.getByRole('button', { name: /Recommend a movie/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Inception/)).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<Page />);
    const button = screen.getByRole('button', { name: /Recommend a movie/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to generate recommendation. Please try again.')).toBeInTheDocument();
    });
  });
});
