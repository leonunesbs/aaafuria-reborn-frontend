import { Button, ButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CustomButtomProps extends ButtonProps {
  children: ReactNode;
}

function CustomButtom({ children, ...rest }: CustomButtomProps) {
  return (
    <Button colorScheme="green" variant="ghost" w="full" {...rest}>
      {children}
    </Button>
  );
}

export default CustomButtom;
