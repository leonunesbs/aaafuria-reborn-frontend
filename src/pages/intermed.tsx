import { Box, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function Intermed() {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [isAuthenticated, router]);

  return (
    <Layout title="Intermed">
      <Box maxW="7xl" mx="auto">
        <PageHeading>VI Intermed Nordeste</PageHeading>
        <SimpleGrid columns={[1, 2]} spacing={2}>
          <Card>
            <Stack>
              <Heading size="md" as="h2">
                1. Cadastre-se do VI INTERMED NORDESTE e reserve seu LOTE
              </Heading>
              <Box
                as="iframe"
                src="/intermed.html"
                w="full"
                h="2xl"
                rounded="md"
              />
            </Stack>
          </Card>

          <Card>
            <Heading size="md" as="h2">
              2. Efetue o pagamento
            </Heading>
          </Card>
        </SimpleGrid>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/entrar?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
};

export default Intermed;
