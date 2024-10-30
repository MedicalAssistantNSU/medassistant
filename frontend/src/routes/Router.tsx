// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ScanHistoryPage from 'src/views/scan-history/ScanHistoryPage';
import AboutUs from 'src/views/aboutus/AboutUs';
import Help from 'src/views/help/Help';
import AuthGuard from 'src/guards/authGuard/AuthGuard';
import GuestGuard from 'src/guards/authGuard/GuestGaurd';
import Login2 from 'src/views/authentication/auth2/Login2';
import Register2 from 'src/views/authentication/auth2/Register2';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

/* ****Apps***** */
const Chats = Loadable(lazy(() => import('../views/apps/chat/Chat')));

const Router = [
  {
    path: '/',
    element: 
    <AuthGuard>
      <FullLayout />
    </AuthGuard>,
    children: [
      { path: '/', element: <Navigate to="/sample-page" /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/scans', exact: true, element: <ScanHistoryPage /> },
      { path: '/about/us', exact: true, element: <AboutUs /> },
      { path: '/help', exact: true, element: <Help /> },
      { path: '/apps/chats', element: <Chats /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: (
      <GuestGuard>
        <BlankLayout />
      </GuestGuard>
    ),
    children: [
      { path: '/auth/login', element: <Login2 /> },
      { path: '/auth/register', element: <Register2 /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
