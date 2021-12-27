import { Button, ButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FiExternalLink } from 'react-icons/fi';

interface CustomButtomProps extends ButtonProps {
  children?: ReactNode;
  hasExternalIcon?: boolean;
}

export const CustomButtom = ({
  children,
  hasExternalIcon,
  ...rest
}: CustomButtomProps) => {
  return (
    <Button
      colorScheme="green"
      variant="ghost"
      w="full"
      rightIcon={hasExternalIcon ? <FiExternalLink size="15px" /> : <></>}
      {...rest}
    >
      {children}
    </Button>
  );
};
