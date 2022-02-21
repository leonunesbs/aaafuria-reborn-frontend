import {
  CustomButtom,
  CustomChakraNextLink,
  FloatingCarrinhoPlantaoButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { InputMatriculaPlantao } from '@/components/molecules';
import { LojaPlantao } from '@/components/organisms';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, Stack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { useContext, useEffect, useState } from 'react';
import { MdShoppingCart } from 'react-icons/md';

function Plantao() {
  const { isStaff } = useContext(AuthContext);
  const router = useRouter();

  const [socioData, setSocioData] = useState<any | null>(null);

  useEffect(() => {
    isStaff === false && router.replace('/');
  }, [isStaff, router]);

  return (
    <Layout title="Plantão de vendas" position={'relative'}>
      {socioData && (
        <CustomChakraNextLink
          href={`/areadiretor/plantao/carrinho?m=${socioData.matricula}`}
        >
          <FloatingCarrinhoPlantaoButton />
        </CustomChakraNextLink>
      )}
      <Box maxW="7xl" mx="auto">
        <PageHeading>Plantão de vendas</PageHeading>
        <InputMatriculaPlantao
          socioData={socioData}
          setSocioData={setSocioData}
        />
        <LojaPlantao matriculaSocio={socioData?.matricula} />
      </Box>
      <Stack mt={10} align="center">
        {socioData && (
          <CustomChakraNextLink
            href={`/areadiretor/plantao/carrinho?m=${socioData.matricula}`}
          >
            <CustomButtom
              colorScheme="gray"
              leftIcon={<MdShoppingCart size="25px" />}
            >
              Ir para o carrinho
            </CustomButtom>
          </CustomChakraNextLink>
        )}
        <VoltarButton href="/areadiretor" />
      </Stack>
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

export default Plantao;
