import { AtividadesSocioTable, Card } from '@/components/molecules';
import { Box, HStack, Stack } from '@chakra-ui/react';
import {
  CustomButtom,
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { FaDrum, FaPlus, FaVolleyballBall } from 'react-icons/fa';
import { useCallback, useContext, useEffect, useState } from 'react';

import { AiOutlineCalendar } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { MdManageAccounts } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AtividadesProps {}

function Atividades({}: AtividadesProps) {
  const { isStaff, checkCredentials, isAuthenticated } =
    useContext(AuthContext);
  const [categoria, setCategoria] = useState('Esporte');
  const router = useRouter();

  const handleCategoria = useCallback(
    (categoria: string) => {
      setCategoria(categoria);
      router.push(`/atividades?categoria=${categoria}`);
    },
    [router],
  );

  useEffect(() => {
    checkCredentials();
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [checkCredentials, isAuthenticated, router]);

  useEffect(() => {
    const query = router.query.categoria;
    if (query && typeof query === 'string') {
      setCategoria(query);
    }
  }, [router.query]);

  return (
    <Layout title="Atividades" desc="Programação de atividades">
      <Box maxW="6xl" mx="auto">
        <PageHeading>Programação de Atividades</PageHeading>
        <Card overflowX="auto">
          <HStack justify="center">
            <CustomIconButton
              aria-label="Esportes"
              icon={<FaVolleyballBall size="25px" />}
              onClick={() => handleCategoria('Esporte')}
              isActive={categoria === 'Esporte'}
            />
            <CustomIconButton
              aria-label="Bateria"
              icon={<FaDrum size="25px" />}
              onClick={() => handleCategoria('Bateria')}
              isActive={categoria === 'Bateria'}
            />
            {isStaff && (
              <CustomIconButton
                aria-label="Diretoria"
                icon={<MdManageAccounts size="25px" />}
                onClick={() => handleCategoria('Diretoria')}
                isActive={categoria === 'Diretoria'}
                colorScheme="yellow"
              />
            )}
          </HStack>
          <AtividadesSocioTable categoria={categoria} />
        </Card>
        <Stack mt={6}>
          {isStaff && (
            <>
              <CustomChakraNextLink
                href="https://diretoria.aaafuria.site/admin/atividades/programacao/add"
                chakraLinkProps={{
                  target: '_blank',
                }}
              >
                <CustomButtom
                  colorScheme="yellow"
                  leftIcon={<FaPlus size="20px" />}
                  hasExternalIcon
                >
                  Nova programação
                </CustomButtom>
              </CustomChakraNextLink>
              <CustomChakraNextLink
                href="https://diretoria.aaafuria.site/admin/atividades/programacao"
                chakraLinkProps={{
                  target: '_blank',
                }}
              >
                <CustomButtom
                  colorScheme="yellow"
                  leftIcon={<AiOutlineCalendar size="20px" />}
                  hasExternalIcon
                >
                  Gerenciar programações
                </CustomButtom>
              </CustomChakraNextLink>
            </>
          )}

          <VoltarButton href="/" />
        </Stack>
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

export default Atividades;
