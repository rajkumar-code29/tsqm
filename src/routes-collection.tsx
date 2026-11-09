import { createBrowserRouter } from 'react-router';
import CollectionGate from './pages/CollectionGate';

/**
 * The private site has exactly one route, and it is not a public one.
 *
 * Every path lands on the gate, which hashes it and reveals the collection
 * only for the one path that matches. The site's own root is a dead end, so
 * finding the deployment tells a visitor nothing.
 */
export const collectionRouter = createBrowserRouter(
  [{ path: '*', Component: CollectionGate }],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') },
);
