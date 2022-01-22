import dynamic from 'next/dynamic';
import { LayoutProps } from './Layout';

export const Layout = dynamic<LayoutProps>(() =>
  import('@/components/templates/Layout').then((mod) => mod.Layout),
);
