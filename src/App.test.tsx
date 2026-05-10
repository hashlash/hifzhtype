import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders setup screen', () => {
  render(<App />);
  const setupTitle = screen.getByText(/إعداد الحفظ/i);
  expect(setupTitle).toBeInTheDocument();
});
