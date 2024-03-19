import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import fetchNOTAMs from './fetchNOTAMs';

interface NotamContextProps {
  identifiers: string[];
  state: 'loading' | 'success' | 'error';
}
const initialState: NotamContextProps = { identifiers: [], state: 'loading' };

const NotamContext = createContext(initialState);

interface NotamProviderProps {
  children: ReactNode;
}

export function NotamProvider({ children }: NotamProviderProps) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    fetchNOTAMs()
      .then((text) => {
        const matches = text.matchAll(/<option value="([A-Z]{3})"/gi);
        setState({
          identifiers: Array.from(matches).map(([, identifier]) => identifier),
          state: 'success',
        });
      })
      .catch(() => setState({ identifiers: [], state: 'error' }));
  }, []);

  return <NotamContext.Provider value={state}>{children}</NotamContext.Provider>;
}

export function useNotam(identifier: string | undefined) {
  const { identifiers, state } = useContext(NotamContext);
  return { hasNOTAM: !!identifier && identifiers.includes(identifier), state };
}
