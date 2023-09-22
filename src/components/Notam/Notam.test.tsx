import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Mock, vi } from 'vitest';

import fetchNOTAMs from './fetchNOTAMs';
import { NotamProvider, useNotam } from './Notam';

const mockedFetchNOTAMs = fetchNOTAMs as Mock;

vi.mock('./fetchNOTAMs', () => ({
  default: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('requests NOTAMs when mounted', async () => {
  mockedFetchNOTAMs.mockResolvedValue('<option value="ASD"></option>');

  const { result, rerender } = renderHook(useNotam, {
    initialProps: 'ASD',
    wrapper: (props) => <NotamProvider {...props} />,
  });
  expect(result.current).toHaveProperty('state', 'loading');

  await act(() => rerender('ASD'));
  expect(mockedFetchNOTAMs).toHaveBeenCalled();
  expect(result.current).toHaveProperty('hasNOTAM', true);

  rerender('not in list');
  expect(result.current).toHaveProperty('hasNOTAM', false);
});

test('handles error response', async () => {
  mockedFetchNOTAMs.mockRejectedValue(new Error('Error!'));

  const { result, rerender } = renderHook(useNotam, {
    initialProps: 'ASD',
    wrapper: (props) => <NotamProvider {...props} />,
  });
  expect(result.current).toHaveProperty('state', 'loading');

  await act(() => rerender('ASD'));
  expect(mockedFetchNOTAMs).toHaveBeenCalled();
  expect(result.current).toHaveProperty('state', 'error');
});
