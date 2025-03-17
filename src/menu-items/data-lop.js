// assets
import { IconSchool } from '@tabler/icons-react';

// constant
const icons = { IconSchool };

// ==============================|| DATA Lớp MENU ITEMS ||============================== //

const dataLop = {
  id: 'dataLop',
  type: 'group',
  children: [
    {
      id: 'dataLop',
      title: 'Data Lớp',
      type: 'item',
      url: '/data-lop',
      icon: icons.IconSchool,
      breadcrumbs: false
    }
  ]
};

export default dataLop;
