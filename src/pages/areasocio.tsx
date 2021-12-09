import { Card } from '@/components/Card';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { gql, useQuery } from '@apollo/client';
import { AuthContext } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import AreaSocioMenu from '@/components/AreaSocioMenu';

const QUERY_PORTAL = gql`
  query portal {
    createPortalUrl {
      stripePortalUrl
    }
  }
`;

function AreaSocio() {
  const router = useRouter();
  const { checkSocio } = useContext(AuthContext);
  const [isSocio] = React.useState(parseCookies()['aaafuriaIsSocio']);

  const { data } = useQuery(QUERY_PORTAL, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  useEffect(() => {
    checkSocio();

    if (isSocio !== 'true') {
      alert('Você não tem permissão para acessar esta área.');
      router.push('/sejasocio');
    }
  }, [checkSocio, isSocio, router]);

  const handleAssociacao = () => {
    console.log(data);
    router.push(data.createPortalUrl.stripePortalUrl);
  };

  return (
    <Layout title="Área do Socio">
      <Box maxW="xl" mx="auto">
        <PageHeading>Área do sócio</PageHeading>
        <Card>
          <AreaSocioMenu handleAssociacao={handleAssociacao} />
        </Card>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaIsSocio']: isSocio } = parseCookies(ctx);

  if (isSocio === 'true') {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: '/sejasocio',
      permanent: false,
    },
  };
};

export default AreaSocio;
