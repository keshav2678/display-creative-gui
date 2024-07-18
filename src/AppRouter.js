import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import UploadCreatives from './pages/UploadCreatives';
import Creatives from './pages/Creatives';
import Trackers from './pages/Trackers';

const AppLayout = ({ children }) => (
  <div >
      <Navbar />
      <div className="App" style={{display:'flex'}}>
    <div className="sidebar-container">
      <Sidebar />
    </div>
    <div className="content">
      <div className="page-content">
        {children}
      </div>
    </div>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><UploadCreatives /></AppLayout>,
  },
  {
    path: '/creatives',
    element: <AppLayout><Creatives /></AppLayout>,
  },
  {
    path: '/trackers',
    element: <AppLayout><Trackers /></AppLayout>,
  },
]);

// const AppRouter = () => {
//   return <RouterProvider router={router} />;
// };

export default router;
