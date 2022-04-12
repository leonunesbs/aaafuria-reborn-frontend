import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

import { CustomIconButton } from '..';

export const ColorModeToggle = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(
    <BsFillMoonFill size="20px" />,
    <BsFillSunFill size="20px" />,
  );
  return (
    <CustomIconButton
      aria-label="colorMode"
      icon={icon}
      onClick={toggleColorMode}
    />
  );
};
