import {
  CustomButton,
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { AtividadesSocioTable, Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, Flex, HStack, Stack, useToast } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import { CgTwilio } from 'react-icons/cg';
import { FaDrum, FaPlus, FaVolleyballBall } from 'react-icons/fa';
import { MdManageAccounts } from 'react-icons/md';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AtividadesProps {}

function Atividades({}: AtividadesProps) {
  const toast = useToast();
  const { isStaff, isSocio, checkCredentials, isAuthenticated } =
    useContext(AuthContext);
  const [categoria, setCategoria] = useState('Esporte');
  const router = useRouter();

  const handleCategoria = useCallback(
    (categoria: string) => {
      setCategoria(categoria);
      router.replace(`/atividades?categoria=${categoria}`);
    },
    [router],
  );

  useEffect(() => {
    checkCredentials();

    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }

    if (isStaff === false) {
      if (isSocio === false) {
        toast({
          title: 'Que pena! Você não é sócio...',
          description: 'Mas nossa associação está aberta, Seja Sócio!',
          status: 'info',
          duration: 2500,
          isClosable: true,
          position: 'top-left',
        });
        router.push('/sejasocio');
      }
    }
  }, [checkCredentials, isAuthenticated, isSocio, isStaff, router, toast]);

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
          <Flex justify={['center', 'flex-end']} mt={4}>
            <CustomChakraNextLink
              href="https://api.whatsapp.com/send/?phone=14155238886&amp;text=join%20break-treated"
              chakraLinkProps={{
                target: '_blank',
                isExternal: true,
              }}
            >
              <CustomButton
                aria-label="ativar-notificacoes"
                leftIcon={<CgTwilio size="25px" />}
              >
                Ativar notificações
              </CustomButton>
            </CustomChakraNextLink>
          </Flex>
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
                <CustomButton
                  colorScheme="yellow"
                  leftIcon={<FaPlus size="20px" />}
                  hasExternalIcon
                >
                  Nova programação
                </CustomButton>
              </CustomChakraNextLink>
              <CustomChakraNextLink
                href="https://diretoria.aaafuria.site/admin/atividades/programacao"
                chakraLinkProps={{
                  target: '_blank',
                }}
              >
                <CustomButton
                  colorScheme="yellow"
                  leftIcon={<AiOutlineCalendar size="20px" />}
                  hasExternalIcon
                >
                  Gerenciar programações
                </CustomButton>
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
