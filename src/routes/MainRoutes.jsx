import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

//Đường dẫn đến Data bàn giao
const DataBanGiao = Loadable(lazy(() => import('../views/data-ban-giao')));
//Đường dẫn đến Edit Data bàn giao
const EditDataBanGiao = Loadable(lazy(() => import('../views/data-ban-giao/edit')));


//Đường dẫn đến Data lớp
const DataLop = Loadable(lazy(() => import('../views/data-lop')));
//Đường dẫn đến Edit Data lớp
const EditDataLop = Loadable(lazy(() => import('../views/data-lop/edit')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'data-lop',
      element: <DataLop />
    },
    {
      path: 'data-ban-giao',
      element: <DataBanGiao />
    },
    {
      path: 'data-ban-giao/edit/:id',
      element: <EditDataBanGiao />
    },
    {
      path: 'data-lop/edit/:classCode',
      element: <EditDataLop />
    },
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
