import { Box, Heading, HStack, Text } from '@chakra-ui/react';

import { CartsTable } from '@/components/atoms';
import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';
import { Card } from '..';

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
          <Text textStyle="italic">Aguardando entrega</Text>
        </Box>
      </HStack>
      <CartsTable />
    </Card>
  );
}

export default CartsDashboardCard;
