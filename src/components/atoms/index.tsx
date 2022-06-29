import { ActivityIconProps } from './ActivityIcon';
import { CustomChakraNextLinkProps } from './CustomChakraNextLink';
import { CustomDividerProps } from './CustomDivider';
import { CustomIconButtonProps } from './CustomIconButton';
import { FloatingCarrinhoPlantaoButtonProps } from './FloatingCarrinhoPlantaoButton';
import { ICarteirinhaInput } from './CarteirinhaInput/ICarteirinhaInput';
import { ICustomButton } from './CustomButton/ICustomButton';
import { IPriceTag } from './PriceTag/IPriceTag';
import { NotificationBadgeProps } from './NotificationBadge';
import { PageHeadingProps } from './PageHeading';
import { PaymentInstructionsProps } from './PaymentInstructions';
import { PaymentMethodsProps } from './PaymentMethods';
import { QuantityCartItemSelectorProps } from './QuantityCartItemSelector';
import { RefAttributes } from 'react';
import { SejaSocioButtonProps } from './SejaSocioButton';
import { VoltarButtonProps } from './VoltarButton';
import dynamic from 'next/dynamic';

export const ActivityIcon = dynamic<ActivityIconProps>(() =>
  import('./ActivityIcon').then((mod) => mod.default),
);
export const Analytics = dynamic<any>(() =>
  import('./Analytics').then((mod) => mod.Analytics),
);
export const ColorModeToggle = dynamic<any>(() =>
  import('./ColorModeToggle').then((mod) => mod.ColorModeToggle),
);
export const CarteirinhaInput = dynamic<ICarteirinhaInput>(() =>
  import('./CarteirinhaInput').then((mod) => mod.CarteirinhaInput),
);
export const CustomButton = dynamic<
  ICustomButton & RefAttributes<HTMLButtonElement>
>(() => import('./CustomButton').then((mod) => mod.CustomButton));

export const CustomIconButton = dynamic<
  CustomIconButtonProps & RefAttributes<HTMLButtonElement>
>(() => import('./CustomIconButton').then((mod) => mod.CustomIconButton));

export const CustomChakraNextLink = dynamic<CustomChakraNextLinkProps>(() =>
  import('./CustomChakraNextLink').then((mod) => mod.CustomChakraNextLink),
);
export const CustomDivider = dynamic<CustomDividerProps>(() =>
  import('./CustomDivider').then((mod) => mod.default),
);

export const FloatingCarrinhoPlantaoButton =
  dynamic<FloatingCarrinhoPlantaoButtonProps>(() =>
    import('./FloatingCarrinhoPlantaoButton').then(
      (mod) => mod.FloatingCarrinhoPlantaoButton,
    ),
  );
export const Fonts = dynamic<any>(() =>
  import('./Fonts').then((mod) => mod.Fonts),
);
export const NotificationBadge = dynamic<NotificationBadgeProps>(() =>
  import('./NotificationBadge').then((mod) => mod.NotificationBadge),
);

export const PageHeading = dynamic<PageHeadingProps>(() =>
  import('./PageHeading').then((mod) => mod.PageHeading),
);
export const PaymentInstructions = dynamic<PaymentInstructionsProps>(() =>
  import('./PaymentInstructions').then((mod) => mod.default),
);
export const PaymentMethods = dynamic<PaymentMethodsProps>(() =>
  import('./PaymentMethods').then((mod) => mod.default),
);

export const PriceTag = dynamic<IPriceTag>(() =>
  import('./PriceTag').then((mod) => mod.PriceTag),
);
export const QuantityCartItemSelector = dynamic<QuantityCartItemSelectorProps>(
  () => import('./QuantityCartItemSelector').then((mod) => mod.default),
);

export const SejaSocioButton = dynamic<SejaSocioButtonProps>(() =>
  import('./SejaSocioButton').then((mod) => mod.SejaSocioButton),
);
export const VoltarButton = dynamic<VoltarButtonProps>(() =>
  import('./VoltarButton').then((mod) => mod.VoltarButton),
);
