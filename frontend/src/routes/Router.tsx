// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from 'src/guards/authGuard/AuthGuard';
import GuestGuard from 'src/guards/authGuard/GuestGaurd';
import AboutUs from 'src/views/aboutus/AboutUs';
import Gallery from 'src/views/apps/user-profile/Gallery';
import UserProfile from 'src/views/apps/user-profile/UserProfile';
import Login2 from 'src/views/authentication/auth2/Login2';
import Register2 from 'src/views/authentication/auth2/Register2';
import Faq from 'src/views/help/Help';
import ScanHistoryPage from 'src/views/scan-history/ScanHistoryPage';
import Settings from 'src/views/settings/Settings';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Posts from '../views/sample-page/SamplePage';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
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
      { path: '/', element: <Navigate to="/posts" /> },
      { path: '/posts', exact: true, element: <Posts /> },
      { path: '/scans', exact: true, element: <ScanHistoryPage /> },
      { path: '/about/us', exact: true, element: <AboutUs /> },
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/help', exact: true, element: <Faq /> },
      { path: '/settings', exact: true, element: <Settings /> },
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
