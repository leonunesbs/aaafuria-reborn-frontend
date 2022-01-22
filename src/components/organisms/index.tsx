import dynamic from 'next/dynamic';
import { LojaPlantaoProps } from './LojaPlantao';

export const LojaPlantao = dynamic<LojaPlantaoProps>(() =>
  import('./LojaPlantao').then((mod) => mod.LojaPlantao),
);
