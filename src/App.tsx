import { createTheme, CssBaseline, LinkProps, ThemeProvider } from '@mui/material';
import { AnchorHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import { createBrowserRouter, Link as ReactRouterLink, RouterProvider } from 'react-router-dom';
import { LegsProvider } from './components/LegsContext';
import { POIsProvider } from './components/POIsContext';
import { StoreProvider } from './components/store';
import MapPage from './pages/map';
import PlanPage from './pages/plan';

const router = createBrowserRouter(
  [
    { element: <PlanPage />, path: '/' },
    { element: <MapPage />, path: '/map' },
  ],
  { basename: '/flight-planner' }
);

const LinkBehavior = forwardRef(
  (
    { href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>,
    ref: ForwardedRef<HTMLAnchorElement>
  ) => <ReactRouterLink to={href || ''} ref={ref} {...props} />
);

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: { component: LinkBehavior } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: { LinkComponent: LinkBehavior },
    },
  },
});

export default function App() {
  return (
    <StoreProvider>
      <POIsProvider>
        <LegsProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </LegsProvider>
      </POIsProvider>
    </StoreProvider>
  );
}
