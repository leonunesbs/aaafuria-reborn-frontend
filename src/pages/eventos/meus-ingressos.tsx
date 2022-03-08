import {
  Box,
  Collapse,
  Flex,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';
import {
  CustomButtom,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useCallback, useContext, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { FaQrcode } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { MdCopyAll } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { parseCookies } from 'nookies';

const USER_INGRESSOS = gql`
  query getUserIngressos {
    userAuthenticatedIngressos {
      id
      dataCompra
      lote {
        nome
        evento {
          nome
        }
      }
    }
  }
`;

function MeusEventos() {
  const { hasCopied, onCopy } = useClipboard('https://bit.ly/3hOcSHR');
  const { token } = useContext(AuthContext);
  const [url, setUrl] = useState('');
  const { data } = useQuery(USER_INGRESSOS, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  const { isOpen, onToggle } = useDisclosure();

  const handleQrCode = useCallback(
    (id: string) => {
      setUrl(`http://${window?.location.host}/areadiretor/ingresso/${id}`);
      onToggle();
    },
    [onToggle],
  );

  return (
    <Layout
      title="Meus ingressos"
      desc="Confira aqui seus ingressos adquiridos para os próximos eventos."
    >
      <Box maxW="xl" mx="auto">
        <PageHeading>Meus ingressos</PageHeading>
        <Card overflowX={'auto'}>
          {data?.userAuthenticatedIngressos?.length == 0 && (
            <Flex align="center" justify="center" flexDirection="column" p={4}>
              <Text>
                <em>Você não possui ingressos para eventos futuros.</em>
              </Text>
            </Flex>
          )}
          {data?.userAuthenticatedIngressos?.map((ingresso: any) => (
            <>
              <CustomButtom
                onClick={onCopy}
                leftIcon={!hasCopied ? <MdCopyAll size="25px" /> : <></>}
              >
                {hasCopied ? 'Copiado!' : 'Copiar link convidados'}
              </CustomButtom>
              <Table key={ingresso.id}>
                <Thead>
                  <Tr>
                    <Td>Lote - Evento</Td>
                    <Td>Data de compra</Td>
                    <Td>Ação</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      {ingresso.lote.nome} - {ingresso.lote.evento.nome}
                    </Td>
                    <Td>
                      {new Date(ingresso?.dataCompra).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        timeZone: 'America/Sao_Paulo',
                      })}
                    </Td>
                    <Td>
                      <CustomIconButton
                        aria-label="qr-code"
                        icon={<FaQrcode size="25px" />}
                        onClick={() => handleQrCode(ingresso.id)}
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </>
          ))}
        </Card>
        <Collapse in={isOpen} animateOpacity>
          <Flex
            py="8"
            px={{ base: '4', md: '10' }}
            justify={'center'}
            flexGrow={1}
          >
            <QRCode value={url} size={256} fgColor="green" />
          </Flex>
        </Collapse>
        <Stack mt={4} align="center">
          <VoltarButton href="/eventos" />
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

export default MeusEventos;
