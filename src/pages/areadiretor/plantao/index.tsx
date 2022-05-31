import { Box, Stack } from '@chakra-ui/react';
import {
  CustomButton,
  CustomChakraNextLink,
  FloatingCarrinhoPlantaoButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { InputMatriculaPlantao } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { LojaPlantao } from '@/components/organisms';
import { MdShoppingCart } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function Plantao() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [socioData, setSocioData] = useState<any | null>(null);

  useEffect(() => {
    user?.isStaff === false && router.replace('/');
  }, [user, router]);

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
            <CustomButton
              colorScheme="gray"
              leftIcon={<MdShoppingCart size="25px" />}
            >
              Ir para o carrinho
            </CustomButton>
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
