import dynamic from 'next/dynamic';
import { RefAttributes } from 'react';
import { AreaDiretorButtonProps } from './AreaDiretorButton';
import { AtividadesSocioTableRowProps } from './AtividadesSocioTableRow';
import { CustomButtomProps } from './CustomButton';
import { CustomChakraNextLinkProps } from './CustomChakraNextLink';
import { CustomIconButtonProps } from './CustomIconButton';
import { FloatingCarrinhoPlantaoButtonProps } from './FloatingCarrinhoPlantaoButton';
import { PageHeadingProps } from './PageHeading';
import { SejaSocioButtonProps } from './SejaSocioButton';

export const Analytics = dynamic<any>(() =>
  import('./Analytics').then((mod) => mod.Analytics),
);
export const ColorModeToggle = dynamic<any>(() =>
  import('./ColorModeToggle').then((mod) => mod.ColorModeToggle),
);
export const AreaDiretorButton = dynamic<AreaDiretorButtonProps>(() =>
  import('./AreaDiretorButton').then((mod) => mod.AreaDiretorButton),
);
export const AtividadesSocioTableRow = dynamic<AtividadesSocioTableRowProps>(
  () =>
    import('./AtividadesSocioTableRow').then(
      (mod) => mod.AtividadesSocioTableRow,
    ),
);
export const CustomButtom = dynamic<
  CustomButtomProps & RefAttributes<HTMLButtonElement>
>(() => import('./CustomButton').then((mod) => mod.CustomButton));

export const CustomIconButton = dynamic<
  CustomIconButtonProps & RefAttributes<HTMLButtonElement>
>(() => import('./CustomIconButton').then((mod) => mod.CustomIconButton));

export const CustomChakraNextLink = dynamic<CustomChakraNextLinkProps>(() =>
  import('./CustomChakraNextLink').then((mod) => mod.CustomChakraNextLink),
);

export const FloatingCarrinhoPlantaoButton =
  dynamic<FloatingCarrinhoPlantaoButtonProps>(() =>
    import('./FloatingCarrinhoPlantaoButton').then(
      (mod) => mod.FloatingCarrinhoPlantaoButton,
    ),
  );

export const PageHeading = dynamic<PageHeadingProps>(() =>
  import('./PageHeading').then((mod) => mod.PageHeading),
);

export const SejaSocioButton = dynamic<SejaSocioButtonProps>(() =>
  import('./SejaSocioButton').then((mod) => mod.SejaSocioButton),
);
