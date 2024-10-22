import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconStar,
  IconHome2,
  IconBrandWechat,
  IconHistory,
  IconSettings,
  IconHelp
} from '@tabler/icons-react';

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Главное',
  },

  {
    id: uniqueId(),
    title: 'Домашняя страница',
    icon: IconHome2,
    href: '/sample-page',
  },
  {
    id: uniqueId(),
    title: 'Чаты',
    icon: IconBrandWechat,
    href: '/apps/chats',
  },
  {
    id: uniqueId(),
    title: 'История сканирований',
    icon: IconHistory,
    href: '/scans',
  },
  {
    id: uniqueId(),
    title: 'Настройки',
    icon: IconSettings,
    href: '',
  },
  {
    navlabel: true,
    subheader: 'Другое',
  },
  {
    id: uniqueId(),
    title: 'О нас',
    icon: IconStar,
    href: '/about/us',
  },

  {
    id: uniqueId(),
    title: 'Поддержка',
    icon: IconHelp,
    href: '/help',
  }
];

export default Menuitems;
