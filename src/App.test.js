import { render, screen } from '@testing-library/react';
import App from './page/overview/MswOverviewPage';

test('renders "Bremgarten" name', () => {
  render(<App />);
  const linkElement = screen.getByText(/Bremgarten/i);
  expect(linkElement).toBeInTheDocument();
});
