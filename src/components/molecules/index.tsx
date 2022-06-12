import { ActivitiesDashboardCardProps } from './ActivitiesDashboardCard';
import { ActivityCardProps } from './ActivityCard';
import { ActivitySchedulesProps } from './ActivitySchedules';
import { AddMembershipDrawerProps } from './AddMembershipDrawer';
import { AddPaymentDrawerProps } from './AddPaymentDrawer';
import { AddScheduleDrawerProps } from './AddScheduleDrawer';
import { AreaMembroMenuProps } from './AreaSocioMenu';
import { CartaoCreditoTabPanelProps } from './PagamentoTabs/CartaoCreditoTabPanel';
import { ClientInfoCardProps } from './ClientInfoCard';
import { CommentCardProps } from './CommentCard';
import { CreateCommentProps } from './CreateComment';
import { EspecieTabPanelProps } from './PagamentoTabs/EspecieTabPanel';
import { HomeMenuProps } from './HomeMenu';
import { IAtividadeSocioTable } from './AtividadesSocioTable/IAtividadesSocioTable';
import { IAuthenticatedHomeMenu } from './AuthenticatedHomeMenu/IAuthenticatedHomeMenu';
import { ICadastroDrawer } from './CadastroDrawer/ICadastroDrawer';
import { ICard } from './Card/ICard';
import { ISejaSocioPricing } from './SejaSocioPricing/ISejaSocioPricing';
import { InputMatriculaPlantaoProps } from './InputMatriculaPlantao';
import { IssueInfoCardProps } from './IssueInfoCard';
import { ManageScheduleDrawerProps } from './ManageScheduleDrawer';
import { MembersDashboardCardProps } from './MembersDashboardCard';
import { PaymentsDashboardCardProps } from './PaymentsDashboardCard';
import { PaymentsTableProps } from './PaymentsTable';
import { PixTabPanelProps } from './PagamentoTabs/PIXTabPanel';
import { ProdutoPlantaoCardProps } from './ProdutoPlantaoCard';
import { RefAttributes } from 'react';
import { ScheduleCardProps } from './ScheduleCard';
import dynamic from 'next/dynamic';

export const ActivitiesDashboardCard = dynamic<ActivitiesDashboardCardProps>(
  () => import('./ActivitiesDashboardCard').then((mod) => mod.default),
);
export const ActivityCard = dynamic<ActivityCardProps>(() =>
  import('./ActivityCard').then((mod) => mod.default),
);
export const ActivitySchedules = dynamic<ActivitySchedulesProps>(() =>
  import('./ActivitySchedules').then((mod) => mod.default),
);
export const AddScheduleDrawer = dynamic<AddScheduleDrawerProps>(() =>
  import('./AddScheduleDrawer').then((mod) => mod.default),
);
export const AddMembershipDrawer = dynamic<AddMembershipDrawerProps>(() =>
  import('./AddMembershipDrawer').then((mod) => mod.default),
);
export const AddPaymentDrawer = dynamic<AddPaymentDrawerProps>(() =>
  import('./AddPaymentDrawer').then((mod) => mod.default),
);
export const AreaSocioMenu = dynamic<AreaMembroMenuProps>(() =>
  import('./AreaSocioMenu').then((mod) => mod.AreaMembroMenu),
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

export const Card = dynamic<ICard & RefAttributes<HTMLDivElement>>(() =>
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
export const ManageScheduleDrawer = dynamic<ManageScheduleDrawerProps>(() =>
  import('./ManageScheduleDrawer').then((mod) => mod.default),
);
export const MembersDashboardCard = dynamic<MembersDashboardCardProps>(() =>
  import('./MembersDashboardCard').then((mod) => mod.default),
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
export const ProdutoCard = dynamic<any>(() =>
  import('./ProdutoCard').then((mod) => mod.ProdutoCard),
);
export const PaymentsDashboardCard = dynamic<PaymentsDashboardCardProps>(() =>
  import('./PaymentsDashboardCard').then((mod) => mod.default),
);
export const PaymentsTable = dynamic<PaymentsTableProps>(() =>
  import('./PaymentsTable').then((mod) => mod.default),
);
export const ProdutoPlantaoCard = dynamic<ProdutoPlantaoCardProps>(() =>
  import('./ProdutoPlantaoCard').then((mod) => mod.ProdutoPlantaoCard),
);
export const ScheduleCard = dynamic<ScheduleCardProps>(() =>
  import('./ScheduleCard').then((mod) => mod.default),
);
export const SejaSocioPricing = dynamic<ISejaSocioPricing>(() =>
  import('./SejaSocioPricing').then((mod) => mod.SejaSocioPricing),
);
export const SocialIcons = dynamic<any>(() =>
  import('./SocialIcons').then((mod) => mod.SocialIcons),
);
