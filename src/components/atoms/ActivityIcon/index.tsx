import { ColorContext } from '@/contexts/ColorContext';
import { Icon } from '@chakra-ui/react';
import { MdSportsSoccer } from 'react-icons/md';
import { useContext } from 'react';

export interface ActivityIconProps {
  activityName: string;
}

function ActivityIcon({ activityName }: ActivityIconProps) {
  const { green } = useContext(ColorContext);
  switch (activityName.toLowerCase()) {
    case 'futsal':
      return <Icon as={MdSportsSoccer} w="10" h="10" color={green} />;
    default:
      return <></>;
  }
}

export default ActivityIcon;
