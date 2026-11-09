import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Vision from './pages/Vision';
import Restoration from './pages/Restoration';
import SupportUs from './pages/SupportUs';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

/**
 * The public site. The private collection is NOT routed here — it is a
 * separate build with its own entry point, so nothing about it reaches this
 * bundle.
 *
 * basename comes from Vite's base, because GitHub Pages serves a project
 * site from /<repo>/ rather than from the domain root.
 */
export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, Component: Home },
        { path: 'history', Component: History },
        { path: 'vision', Component: Vision },
        { path: 'restoration', Component: Restoration },
        { path: 'support', Component: SupportUs },
        { path: 'contact', Component: Contact },
        { path: 'privacy', Component: Privacy },
        { path: '*', Component: NotFound },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') },
);
