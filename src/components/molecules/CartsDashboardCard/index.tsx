import { Box, HStack, Heading, Text } from '@chakra-ui/react';
import { CartsTable, CustomChakraNextLink } from '@/components/atoms';

import { Card } from '..';
import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CartsDashboardCardProps {}

function CartsDashboardCard({}: CartsDashboardCardProps) {
  const { green } = useContext(ColorContext);
  return (
    <Card>
      <HStack mb={4} w="full" justify={'space-between'}>
        <CustomChakraNextLink href={'/bank/payments'}>
          <Box>
            <Heading size="md" color={green}>
              PEDIDOS
            </Heading>
            <Text textStyle="italic">Aguardando entrega</Text>
          </Box>
        </CustomChakraNextLink>
      </HStack>
      <CartsTable pageSize={5} />
    </Card>
  );
}

export default CartsDashboardCard;
