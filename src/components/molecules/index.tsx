import dynamic from 'next/dynamic';
import { AreaDiretorMenuProps } from './AreaDiretorMenu';
import { AreaSocioMenuProps } from './AreaSocioMenu';
import { IAtividadeSocioTable } from './AtividadesSocioTable/IAtividadesSocioTable';
import { IAuthenticatedHomeMenu } from './AuthenticatedHomeMenu/IAuthenticatedHomeMenu';
import { ICadastroDrawer } from './CadastroDrawer/ICadastroDrawer';
import { ICard } from './Card/ICard';
import { ClientInfoCardProps } from './ClientInfoCard';
import { CommentCardProps } from './CommentCard';
import { CreateCommentProps } from './CreateComment';
import { HomeMenuProps } from './HomeMenu';
import { InputMatriculaPlantaoProps } from './InputMatriculaPlantao';
import { IssueInfoCardProps } from './IssueInfoCard';
import { CartaoCreditoTabPanelProps } from './PagamentoTabs/CartaoCreditoTabPanel';
import { EspecieTabPanelProps } from './PagamentoTabs/EspecieTabPanel';
import { PixTabPanelProps } from './PagamentoTabs/PIXTabPanel';
import { ProdutoCardProps } from './ProdutoCard';
import { ProdutoPlantaoCardProps } from './ProdutoPlantaoCard';
import { ISejaSocioPricing } from './SejaSocioPricing/ISejaSocioPricing';

export const AreaDiretorMenu = dynamic<AreaDiretorMenuProps>(() =>
  import('./AreaDiretorMenu').then((mod) => mod.AreaDiretorMenu),
);
export const AreaSocioMenu = dynamic<AreaSocioMenuProps>(() =>
  import('./AreaSocioMenu').then((mod) => mod.AreaSocioMenu),
);
export const AtividadesSocioTable = dynamic<IAtividadeSocioTable>(() =>
  import('./AtividadesSocioTable').then((mod) => mod.AtividadesSocioTable),
);
export const AuthenticatedHomeMenu = dynamic<IAuthenticatedHomeMenu>(() =>
  import('./AuthenticatedHomeMenu').then((mod) => mod.AuthenticatedHomeMenu),
);
export const CadastroDrawer = dynamic<ICadastroDrawer>(() =>
  import('./CadastroDrawer').then((mod) => mod.CadastroDrawer),
);
export const Card = dynamic<ICard>(() =>
  import('./Card').then((mod) => mod.Card),
);
export const ClientInfoCard = dynamic<ClientInfoCardProps>(() =>
  import('./ClientInfoCard').then((mod) => mod.ClientInfoCard),
);
export const CommentCard = dynamic<CommentCardProps>(() =>
  import('./CommentCard').then((mod) => mod.CommentCard),
);
export const CreateComment = dynamic<CreateCommentProps>(() =>
  import('./CreateComment').then((mod) => mod.CreateComment),
);
export const EmailConfirmation = dynamic<IEmailConfirmation>(() =>
  import('./EmailConfirmation').then((mod) => mod.EmailConfirmation),
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
export const InputMatriculaPlantao = dynamic<InputMatriculaPlantaoProps>(() =>
  import('./InputMatriculaPlantao').then((mod) => mod.InputMatriculaPlantao),
);
export const IssueInfoCard = dynamic<IssueInfoCardProps>(() =>
  import('./IssueInfoCard').then((mod) => mod.IssueInfoCard),
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
export const SejaSocioPricing = dynamic<ISejaSocioPricing>(() =>
  import('./SejaSocioPricing').then((mod) => mod.SejaSocioPricing),
);
export const SocialIcons = dynamic<any>(() =>
  import('./SocialIcons').then((mod) => mod.SocialIcons),
);
