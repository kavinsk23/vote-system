import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

test('renders Register component', () => {
  render(<Register />);
  expect(screen.getByText(/Register/i)).toBeInTheDocument();
});

test('validates email format', () => {
  render(<Register />);
  const emailInput = screen.getByLabelText(/Email/i);
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.blur(emailInput);
  expect(screen.getByText(/Only valid university email addresses are allowed to register./i)).toBeInTheDocument();
});