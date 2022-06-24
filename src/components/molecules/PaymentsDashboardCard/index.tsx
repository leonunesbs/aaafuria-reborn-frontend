import { AddPaymentDrawer, Card, PaymentsTable } from '@/components/molecules';
import { Box, HStack, Heading } from '@chakra-ui/react';

import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaymentsDashboardCardProps {}

function PaymentsDashboardCard({}: PaymentsDashboardCardProps) {
  const { green } = useContext(ColorContext);
  return (
    <Card>
      <HStack mb={4} w="full" justify={'space-between'}>
        <Box>
          <Heading size="md" color={green}>
            PAGAMENTOS
          </Heading>
        </Box>
        <AddPaymentDrawer />
      </HStack>
      <PaymentsTable />
    </Card>
  );
}

export default PaymentsDashboardCard;
