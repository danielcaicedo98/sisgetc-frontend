import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir a la página de login
  if (!token) {
    return <Navigate to="/auth/signin" />;
  }

  // Si hay token, renderizar los hijos
  return children;
};

export default PrivateRoute;


/*

import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './components/PrivateRoute'; // Importa el nuevo componente

import { BASE_URL } from './config/constant';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;
        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>
                  {route.protected ? (
                    <PrivateRoute>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</PrivateRoute>
                  ) : (
                    route.routes ? renderRoutes(route.routes) : <Element props={true} />
                  )}
                </Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signin',
    element: lazy(() => import('./views/auth/signin/SignIn1')),
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/',
        element: lazy(() => import('./views/home/home')),
        protected: true, // Añade esta propiedad
      },
      {
        exact: 'true',
        path: '/purchases',
        element: lazy(() => import('./views/purchases/purchases')),
        protected: true, // Añade esta propiedad
      },
      {
        exact: 'true',
        path: '/sales',
        element: lazy(() => import('./views/sales/sales')),
        protected: true, // Añade esta propiedad
      },
      {
        exact: 'true',
        path: '/reports',
        element: lazy(() => import('./views/reports/reports')),
        protected: true, // Añade esta propiedad
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />,
      },
    ],
  },
];

export default renderRoutes;




*/
