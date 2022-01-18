import { useRouter } from 'next/router';
import { AiOutlineCalendar } from 'react-icons/ai';
import { AtividadesSocioTable, Card } from '@/components/molecules';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, Stack } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { Layout } from '@/components/templates';
import { useContext, useEffect } from 'react';
import {
  CustomButtom,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';
import { MdArrowLeft } from 'react-icons/md';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AtividadesProps {}

function Atividades({}: AtividadesProps) {
  const { isStaff, checkCredentials } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    checkCredentials();
  }, [checkCredentials, router]);

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

          <CustomChakraNextLink href="/">
            <CustomButtom
              leftIcon={<MdArrowLeft size="25px" />}
              colorScheme="red"
            >
              Voltar
            </CustomButtom>
          </CustomChakraNextLink>
        </Stack>
      </Box>
    </Layout>
  );
}

export default Atividades;
