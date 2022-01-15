import router from 'next/router';
import { AiOutlineCalendar } from 'react-icons/ai';
import { AtividadesSocioTable, Card } from '@/components/molecules';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, Stack } from '@chakra-ui/react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import {
  CustomButtom,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AtividadesProps {}

function Atividades({}: AtividadesProps) {
  const { isStaff, checkCredentials } = useContext(AuthContext);
  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  return (
    <Layout title="Atividades" desc="Programação de atividades">
      <Box maxW="6xl" mx="auto">
        <PageHeading>Programação de Atividades</PageHeading>
        <Card overflowX="auto">
          <AtividadesSocioTable />
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
          <CustomButtom
            colorScheme="gray"
            leftIcon={<FaArrowLeft size="20px" />}
            onClick={() => router.push('/')}
          >
            Voltar
          </CustomButtom>
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
    props: {},
  };
};

export default Atividades;
