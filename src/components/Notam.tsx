import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
    fetch('http://ais.anac.gov.ar/notam')
      .then((res) => res.text())
      .then((text) => {
        const matches = text.matchAll(/<option value="([A-Z]{3})"/g);
        setState({
          identifiers: Array.from(matches).map(([, identifier]) => identifier),
          state: 'success',
        });
      })
      .catch(() => setState({ identifiers: [], state: 'error' }));
  }, []);

  return <NotamContext.Provider value={state}>{children}</NotamContext.Provider>;
}

export function useNotam(identifier: string) {
  const { identifiers, state } = useContext(NotamContext);
  return { hasNotam: identifiers.includes(identifier), state };
}
