import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TimeInput from './TimeInput';

describe('formats time inputs', () => {
  function testTimeFormatting(input: string, expected: string) {
    test(`formats ${input} to ${expected}`, async () => {
      render(<TimeInput />);
      const textBox = screen.getByRole('textbox');

      const user = userEvent.setup();
      await user.type(textBox, input);
      fireEvent.blur(textBox);
      expect(textBox).toHaveValue(expected);
    });
  }

  testTimeFormatting('8', '08:00');
  testTimeFormatting('8:1', '08:01');
  testTimeFormatting(' 8 ', '08:00');
  testTimeFormatting('0854', '08:54');
});

test.skip('text is replaced after focus', async () => {
  render(<TimeInput />);
  const textBox = screen.getByRole('textbox');

  const user = userEvent.setup();
  await user.type(textBox, '1234');
  fireEvent.blur(textBox);
  await user.click(textBox);
  await user.keyboard('4321');
  expect(textBox).toHaveValue('43:21');
});
