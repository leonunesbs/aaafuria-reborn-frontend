import { Box, HStack, Heading } from '@chakra-ui/react';
import { Card, CartsTable } from '@/components/molecules';

import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CartsDashboardCardProps {}

function CartsDashboardCard({}: CartsDashboardCardProps) {
  const { green } = useContext(ColorContext);
  return (
    <Card>
      <HStack mb={4} w="full" justify={'space-between'}>
        <Box>
          <Heading size="md" color={green}>
            PEDIDOS
          </Heading>
        </Box>
      </HStack>
      <CartsTable />
    </Card>
  );
}

export default CartsDashboardCard;
