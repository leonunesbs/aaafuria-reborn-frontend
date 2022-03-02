import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CustomButtom, PageHeading } from '@/components/atoms';
import { gql, useMutation } from '@apollo/client';
import { useContext, useRef } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const RESGATAR_INTERMED = gql`
  mutation {
    resgatarIntermed {
      ok
    }
  }
`;

function Intermed() {
  const router = useRouter();
  const { token, isSocio } = useContext(AuthContext);
  const [resgatarIntermed] = useMutation(RESGATAR_INTERMED, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleResgate = async () => {
    onClose();
    await resgatarIntermed().catch((err) => {
      alert(err.message);
    });
    router.push('https://cheersshop.com.br/produto/16832');
  };

  const handleInscricao = () => {
    if (isSocio) {
      onOpen();
    } else {
      handleResgate();
    }
  };

  return (
    <Layout title="Intermed">
      <Box maxW="xl" mx="auto">
        <PageHeading>Intermed Norte</PageHeading>
        <Card>
          <Text textAlign={'center'}>PIX: pix@aaafuria.site</Text>
          <Stack>
            <CustomButtom onClick={handleInscricao}>
              Inscreva-se no INTERMED NORTE
            </CustomButtom>
          </Stack>
        </Card>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Resgatar Desconto
              </AlertDialogHeader>

              <AlertDialogBody>
                Deseja usar <strong>900 Calangos</strong> para ativar seu
                desconto? <em>Esta ação não poderá ser desfeita.</em>
              </AlertDialogBody>

              <AlertDialogFooter>
                <CustomButtom colorScheme="red" onClick={onClose}>
                  Cancel
                </CustomButtom>
                <CustomButtom onClick={handleResgate} ml={3}>
                  Confirmar
                </CustomButtom>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
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

export default Intermed;
