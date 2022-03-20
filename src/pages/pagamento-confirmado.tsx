import { PageHeading, VoltarButton } from '@/components/atoms';

import { Box } from '@chakra-ui/react';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';

function PagamentoConfirmado() {
  return (
    <Layout title="Pagamento confirmado">
      <Box maxW="xl" mx="auto">
        <Card>
          <PageHeading>Pagamento confirmado!</PageHeading>
        </Card>
        <VoltarButton href="/" />
      </Box>
    </Layout>
  );
}

export default PagamentoConfirmado;
