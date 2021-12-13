import AtividadesSocioTable from '@/components/AtividadesSocioTable';
import CustomButtom from '@/components/CustomButtom';
import CustomChakraNextLink from '@/components/CustomChakraNextLink';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import router from 'next/router';
import { AiOutlineCalendar } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, Stack } from '@chakra-ui/react';
import { Card } from '@/components/Card';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useContext, useEffect } from 'react';

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
          {!isStaff && (
            <>
              <CustomChakraNextLink
                href={`${process.env.BACKEND_DOMAIN}/admin/atividades/programacao/add/`}
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
                href={`${process.env.BACKEND_DOMAIN}/admin/atividades/programacao`}
                chakraLinkProps={{
                  target: '_blank',
                }}
              >
                <CustomButtom
                  colorScheme="yellow"
                  leftIcon={<AiOutlineCalendar size="20px" />}
                  hasExternalIcon
                >
                  Gerenciar
                </CustomButtom>
              </CustomChakraNextLink>
            </>
          )}
          <CustomButtom
            colorScheme="gray"
            leftIcon={<FaArrowLeft size="20px" />}
            onClick={() => router.back()}
          >
            Voltar
          </CustomButtom>
        </Stack>
      </Box>
    </Layout>
  );
}

export default Atividades;
