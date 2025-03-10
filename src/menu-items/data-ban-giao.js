// assets
import { IconDatabase } from '@tabler/icons-react';

// constant
const icons = { IconDatabase };

// ==============================|| DATA BÀN GIAO MENU ITEMS ||============================== //

const dataBanGiao = {
  id: 'dataBanGiao',
  type: 'group',
  children: [
    {
      id: 'dataBanGiao',
      title: 'Data bàn giao',
      type: 'item',
      url: '/data-ban-giao',
      icon: icons.IconDatabase,
      breadcrumbs: false
    }
  ]
};

export default dataBanGiao;
