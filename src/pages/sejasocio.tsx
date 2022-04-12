import { PageHeading, VoltarButton } from '@/components/atoms';
import { SejaSocioPricing, SocialIcons } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { Box, Stack, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

function SejaSocio() {
  const router = useRouter();
  const { green } = useContext(ColorContext);
  const toast = useToast();

  const { checkCredentials, isSocio } = useContext(AuthContext);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  useEffect(() => {
    if (isSocio) {
      toast({
        title: 'Você já é um sócio!',
        status: 'info',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/areasocio');
    }
  }, [isSocio, router, toast]);

  return (
    <Layout
      title="Seja sócio"
      desc="Junte-se à nós escolhendo o plano de associação que melhor se encaixa com você! Aproveite agora o desconto na primeira associação e Seja Sócio!"
    >
      <Box maxW="5xl" mx="auto">
        <PageHeading>
          Junte-se a nós, seja um{' '}
          <Text as="span" color={green}>
            sócio Fúria
          </Text>
          !
        </PageHeading>
        <SejaSocioPricing />
        <Stack align="center">
          <VoltarButton href="/" />
        </Stack>
        <SocialIcons mt={[4, 8]} />
      </Box>
    </Layout>
  );
}

export default SejaSocio;
