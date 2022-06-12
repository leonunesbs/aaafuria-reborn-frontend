import { AddPaymentDrawer, Card, PaymentsTable } from '@/components/molecules';
import { HStack, Heading } from '@chakra-ui/react';

import { ColorContext } from '@/contexts/ColorContext';
import { CustomChakraNextLink } from '@/components/atoms';
import { useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaymentsDashboardCardProps {}

function PaymentsDashboardCard({}: PaymentsDashboardCardProps) {
  const { green } = useContext(ColorContext);
  return (
    <Card>
      <HStack mb={4} w="full" justify={'space-between'}>
        <CustomChakraNextLink href={'/bank/payments'}>
          <Heading size="md" color={green}>
            ÚLTIMOS PAGAMENTOS
          </Heading>
        </CustomChakraNextLink>
        <AddPaymentDrawer />
      </HStack>
      <PaymentsTable pageSize={5} shortView />
    </Card>
  );
}

export default PaymentsDashboardCard;
