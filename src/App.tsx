import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AnchorHTMLAttributes, ForwardedRef, forwardRef, useEffect } from 'react';
import { createBrowserRouter, Link as ReactRouterLink, RouterProvider } from 'react-router-dom';
import { navigatorDetector } from 'typesafe-i18n/detectors';

import FeedbackLink from './components/FeedbackLink';
import { LegsProvider } from './components/LegsContext';
import { POIsProvider } from './components/POIsContext';
import { StoreProvider } from './components/store';
import TypesafeI18n from './i18n/i18n-react';
import { detectLocale } from './i18n/i18n-util';
import { loadLocale } from './i18n/i18n-util.sync';

const router = createBrowserRouter(
  [
    { lazy: () => import('./pages/plan'), path: '/' },
    { lazy: () => import('./pages/map'), path: '/map' },
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
      <POIsProvider>
        <LegsProvider>
          <ThemeProvider theme={theme}>
            <TypesafeI18n locale={locale}>
              <CssBaseline />
              <FeedbackLink />
              <RouterProvider router={router} />
            </TypesafeI18n>
          </ThemeProvider>
        </LegsProvider>
      </POIsProvider>
    </StoreProvider>
  );
}
