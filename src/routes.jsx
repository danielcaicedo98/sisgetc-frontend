import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

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
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
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
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/',
        element: lazy(() => import('./views/home/home'))
      },
      {
        exact: 'true',
        path: '/purchases',
        element: lazy(() => import('./views/purchases/purchases'))
      },
      {
        exact: 'true',
        path: '/purchases-list',
        element: lazy(() => import('./views/purchases/PurchaseList'))
      },
      {
        exact: 'true',
        path: '/sales',
        element: lazy(() => import('./views/sales/sales'))
      },
      {
        exact: 'true',
        path: '/reports',
        element: lazy(() => import('./views/reports/reports'))
      },
      {
        exact: 'true',
        path: '/customer',
        element: lazy(() => import('./views/customer/customer'))
      },
      {
        exact: 'true',
        path: '/customer-list',
        element: lazy(() => import('./views/customer/customerList'))

      },
      ,
      {
        exact: 'true',
        path: '/products',
        element: lazy(() => import('./views/products/ProductCrud'))

      },
      {
        exact: 'true',
        path: '/reportPurchases',
        element: lazy(() => import('./views/reports/report_pruchase/report_purchase'))

      },{
        exact: 'true',
        path: '/salesReport',
        element: lazy(() => import('./views/reports/sales_report/SalesReport'))

      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;
