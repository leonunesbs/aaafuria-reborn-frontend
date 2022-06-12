import {
  MdSportsBasketball,
  MdSportsHandball,
  MdSportsSoccer,
  MdSportsTennis,
  MdSportsVolleyball,
} from 'react-icons/md';

import { BiSwim } from 'react-icons/bi';
import { ColorContext } from '@/contexts/ColorContext';
import { FaDrum } from 'react-icons/fa';
import { GiPokerHand } from 'react-icons/gi';
import { Icon } from '@chakra-ui/react';
import { RiBilliardsFill } from 'react-icons/ri';
import { useContext } from 'react';

export interface ActivityIconProps {
  activityName: string;
}

function ActivityIcon({ activityName }: ActivityIconProps) {
  const { green } = useContext(ColorContext);
  switch (activityName.toLowerCase()) {
    case 'futsal':
      return <Icon as={MdSportsSoccer} w="10" h="10" color={green} />;
    case 'carabina':
      return <Icon as={FaDrum} w="10" h="10" color={green} />;
    case 'society':
      return <Icon as={MdSportsSoccer} w="10" h="10" color={green} />;
    case 'basquete':
      return <Icon as={MdSportsBasketball} w="10" h="10" color={green} />;
    case 'handebol':
      return <Icon as={MdSportsHandball} w="10" h="10" color={green} />;
    case 'vôlei':
      return <Icon as={MdSportsVolleyball} w="10" h="10" color={green} />;
    case 'tênis de mesa':
      return <Icon as={MdSportsTennis} w="10" h="10" color={green} />;
    case 'poker':
      return <Icon as={GiPokerHand} w="10" h="10" color={green} />;
    case 'truco':
      return <Icon as={GiPokerHand} w="10" h="10" color={green} />;
    case 'natação':
      return <Icon as={BiSwim} w="10" h="10" color={green} />;
    case 'sinuca':
      return <Icon as={RiBilliardsFill} w="10" h="10" color={green} />;
    default:
      return <></>;
  }
}

export default ActivityIcon;
