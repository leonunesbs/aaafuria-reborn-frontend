import { Box } from '@chakra-ui/react';
import { Layout } from '@/components/templates/Layout';
import { PageHeading } from '@/components/atoms';

function Activity() {
  return (
    <Layout title="Activity">
      <Box maxW="7xl" mx="auto">
        <PageHeading>Nome da Atividade</PageHeading>
      </Box>
    </Layout>
  );
}

export default Activity;
