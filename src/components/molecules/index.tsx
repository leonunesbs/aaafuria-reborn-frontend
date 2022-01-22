import dynamic from 'next/dynamic';
import { AtividadesSocioTableProps } from './AtividadesSocioTable';
import { AuthenticatedHomeMenuProps } from './AuthenticatedHomeMenu';
import { CadastroDrawerProps } from './CadastroDrawer';
import { AreaDiretorMenuProps } from './AreaDiretorMenu';
import { AreaSocioMenuProps } from './AreaSocioMenu';
import { CardProps } from './Card';
import { HomeMenuProps } from './HomeMenu';
import { CartaoCreditoTabPanelProps } from './PagamentoTabs/CartaoCreditoTabPanel';
import { EspecieTabPanelProps } from './PagamentoTabs/EspecieTabPanel';
import { PixTabPanelProps } from './PagamentoTabs/PIXTabPanel';
import { ProdutoPlantaoCardProps } from './ProdutoPlantaoCard';
import { ProdutoCardProps } from './ProdutoCard';

export const AreaDiretorMenu = dynamic<AreaDiretorMenuProps>(() =>
  import('./AreaDiretorMenu').then((mod) => mod.AreaDiretorMenu),
);
export const AreaSocioMenu = dynamic<AreaSocioMenuProps>(() =>
  import('./AreaSocioMenu').then((mod) => mod.AreaSocioMenu),
);
export const AtividadesSocioTable = dynamic<AtividadesSocioTableProps>(() =>
  import('./AtividadesSocioTable').then((mod) => mod.AtividadesSocioTable),
);
export const AuthenticatedHomeMenu = dynamic<AuthenticatedHomeMenuProps>(() =>
  import('./AuthenticatedHomeMenu').then((mod) => mod.AuthenticatedHomeMenu),
);
export const CadastroDrawer = dynamic<CadastroDrawerProps>(() =>
  import('./CadastroDrawer').then((mod) => mod.CadastroDrawer),
);
export const Card = dynamic<CardProps>(() =>
  import('./Card').then((mod) => mod.Card),
);
export const Header = dynamic<any>(() =>
  import('./Header').then((mod) => mod.Header),
);
export const Footer = dynamic<any>(() =>
  import('./Footer').then((mod) => mod.Footer),
);
export const HomeMenu = dynamic<HomeMenuProps>(() =>
  import('./HomeMenu').then((mod) => mod.HomeMenu),
);
export const CartaoCreditoTabPanel = dynamic<CartaoCreditoTabPanelProps>(() =>
  import('./PagamentoTabs/CartaoCreditoTabPanel').then(
    (mod) => mod.CartaoCreditoTabPanel,
  ),
);
export const EspecieTabPanel = dynamic<EspecieTabPanelProps>(() =>
  import('./PagamentoTabs/EspecieTabPanel').then((mod) => mod.EspecieTabPanel),
);
export const PixTabPanel = dynamic<PixTabPanelProps>(() =>
  import('./PagamentoTabs/PIXTabPanel').then((mod) => mod.PixTabPanel),
);
export const ProdutoCard = dynamic<ProdutoCardProps>(() =>
  import('./ProdutoCard').then((mod) => mod.ProdutoCard),
);
export const ProdutoPlantaoCard = dynamic<ProdutoPlantaoCardProps>(() =>
  import('./ProdutoPlantaoCard').then((mod) => mod.ProdutoPlantaoCard),
);
export const SocialIcons = dynamic<any>(() =>
  import('./SocialIcons').then((mod) => mod.SocialIcons),
);
