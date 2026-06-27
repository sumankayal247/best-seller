import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

// Route-level code splitting: each page is its own chunk, loaded on demand.
const HomePage = lazy(() => import('@/pages/HomePage'));
const PlatformPage = lazy(() => import('@/pages/PlatformPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="p/:platformId" element={<PlatformPage />} />
        <Route path="p/:platformId/:categoryId" element={<CategoryPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
