import { AreaSocioMenu, Card } from '@/components/molecules';

import { Box } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import React from 'react';
import { parseCookies } from 'nookies';

function AreaMembro() {
  return (
    <Layout title="Minha conta">
      <Box maxW="xl" mx="auto">
        <PageHeading>Minha conta</PageHeading>
        <Card>
          <AreaSocioMenu />
        </Card>
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
    props: {},
  };
};

export default AreaMembro;
