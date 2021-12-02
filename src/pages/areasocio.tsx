import { Card } from '@/components/Card';
import {
  Box,
  Button,
  Divider,
  Heading,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { MdManageAccounts } from 'react-icons/md';
import { AiFillIdcard, AiFillHome } from 'react-icons/ai';
import { FaVolleyballBall } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { gql, useQuery } from '@apollo/client';
import { AuthContext } from '@/contexts/AuthContext';

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
    router.push(data.createPortalUrl.stripePortalUrl);
  };

  return (
    <Box
      bg={useColorModeValue('gray.50', 'inherit')}
      minH="100vh"
      py="12"
      px={{ base: '4', lg: '8' }}
    >
      <Box maxW="xl" mx="auto">
        <Heading
          as="h1"
          textAlign="center"
          size="xl"
          fontWeight="extrabold"
          mb={4}
        >
          Área do sócio
        </Heading>
        <Card>
          <Stack>
            <Button
              leftIcon={<AiFillIdcard size="20px" />}
              colorScheme="green"
              onClick={() => router.push('/carteirinha')}
            >
              Carteirinha
            </Button>
            <Button
              leftIcon={<FaVolleyballBall size="20px" />}
              colorScheme="green"
              isDisabled
            >
              Treinos
            </Button>
            <Divider height="15px" />
            <Button
              leftIcon={<MdManageAccounts size="20px" />}
              rightIcon={<FiExternalLink size="15px" />}
              colorScheme="yellow"
              onClick={handleAssociacao}
            >
              Gerenciar Associação
            </Button>
            <Button
              leftIcon={<AiFillHome size="20px" />}
              colorScheme="gray"
              onClick={() => router.push('/')}
            >
              Voltar
            </Button>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaIsSocio']: isSocio } = parseCookies(ctx);

  if (isSocio === 'false') {
    return {
      redirect: {
        destination: '/sejasocio',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AreaSocio;
