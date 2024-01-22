import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AnchorHTMLAttributes, ForwardedRef, forwardRef, useEffect } from 'react';
import {
  createBrowserRouter,
  Link as ReactRouterLink,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { navigatorDetector } from 'typesafe-i18n/detectors';

import Layout from './components/Layout';
import { NotamProvider } from './components/Notam';
import { POIsProvider } from './components/POIsContext';
import { StoreProvider } from './components/store';
import TypesafeI18n from './i18n/i18n-react';
import { detectLocale } from './i18n/i18n-util';
import { loadLocale } from './i18n/i18n-util.sync';

const router = createBrowserRouter(
  [
    {
      Component: Layout,
      children: [
        { lazy: () => import('./pages/map'), path: '/map/*' },
        { lazy: () => import('./pages/plan'), path: '/plan' },
        { lazy: () => import('./pages/plan-next'), path: '/plan-next' },
        { lazy: () => import('./pages/plane'), path: '/plane' },
        { lazy: () => import('./pages/details'), path: '/airport/:id' },
        { lazy: () => import('./pages/details'), path: '/airspace/:id' },
        { lazy: () => import('./pages/details'), path: '/reporting-point/:id' },
        { Component: () => <Navigate to="/map" replace={true} />, path: '/' },
      ],
    },
  ],
  { basename: '/flight-planner' },
);

const LinkBehavior = forwardRef(function LinkBehavior(
  { href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  return <ReactRouterLink to={href || ''} ref={ref} {...props} />;
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: { component: LinkBehavior },
    },
    MuiButtonBase: {
      defaultProps: { LinkComponent: LinkBehavior },
    },
  },
});

export default function App() {
  const locale = detectLocale(navigatorDetector);
  loadLocale(locale);

  useEffect(() => {
    const [htmlElement] = document.getElementsByTagName('html');
    htmlElement.lang = locale;
  }, [locale]);

  return (
    <StoreProvider>
      <NotamProvider>
        <POIsProvider>
          <ThemeProvider theme={theme}>
            <TypesafeI18n locale={locale}>
              <CssBaseline />
              <RouterProvider router={router} />
            </TypesafeI18n>
          </ThemeProvider>
        </POIsProvider>
      </NotamProvider>
    </StoreProvider>
  );
}
