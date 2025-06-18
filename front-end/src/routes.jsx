import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ManagerDashboard = lazy(() => import('./pages/dashboard/ManagerDashboard'));
const DeveloperDashboard = lazy(() => import('./pages/dashboard/DeveloperDashboard'));
const ProjectsListPage = lazy(() => import('./pages/projects/ProjectsListPage'));
const ProjectCreatePage = lazy(() => import('./pages/projects/ProjectCreatePage'));
const ProjectDetailPage = lazy(() => import('./pages/projects/ProjectDetailPage'));
const HomeRedirect = lazy(() => import('./components/common/HomeRedirect'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<Layout />}>
          {/* Home route - no role restriction */}
          <Route
            index
            element={
              <ProtectedRoute>
                <HomeRedirect />
              </ProtectedRoute>
            }
          />

          {/* Project routes */}
          <Route path="/projects">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={['project_manager']}>
                  <ProjectsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute allowedRoles={['project_manager']}>
                  <ProjectCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute allowedRoles={['project_manager', 'developer']}>
                  <ProjectDetailPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Manager routes */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute allowedRoles={['project_manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Developer routes */}
          <Route
            path="/developer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;