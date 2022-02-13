import {
  CustomButtom,
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
} from '@/components/atoms';
import { AtividadesSocioTable, Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, HStack, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaDrum, FaPlus, FaVolleyballBall } from 'react-icons/fa';
import { MdArrowLeft } from 'react-icons/md';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AtividadesProps {}

function Atividades({}: AtividadesProps) {
  const { isStaff, checkCredentials } = useContext(AuthContext);
  const [categoria, setCategoria] = useState('Esporte');
  const router = useRouter();

  const handleCategoria = (categoria: string) => {
    setCategoria(categoria);
    router.push(`/atividades?categoria=${categoria}`);
  };

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials, router]);

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
          </HStack>
          <AtividadesSocioTable categoria={categoria} />
        </Card>
        <Stack mt={6}>
          {isStaff && (
            <>
              <CustomChakraNextLink
                href="https://aaafuria-reborn.herokuapp.com/admin/atividades/programacao/add"
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
                href="https://aaafuria-reborn.herokuapp.com/admin/atividades/programacao"
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
