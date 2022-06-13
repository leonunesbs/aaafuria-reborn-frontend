import { Box, HStack, Heading, Text } from '@chakra-ui/react';

import { Card } from '..';
import { CartsTable } from '@/components/atoms';
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
          <Text textStyle="italic">Aguardando entrega</Text>
        </Box>
      </HStack>
      <CartsTable pageSize={5} />
    </Card>
  );
}

export default CartsDashboardCard;
