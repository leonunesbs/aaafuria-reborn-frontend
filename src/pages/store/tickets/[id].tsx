import {
  Badge,
  Box,
  Center,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useBreakpointValue,
  useDimensions,
} from '@chakra-ui/react';
import {
  CustomIconButton,
  PageHeading,
  TicketCircles,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect, useRef, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { FaWhatsapp } from 'react-icons/fa';
import { Layout } from '@/components/templates/Layout';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/router';

const GET_TICKET = gql`
  query getTicket($id: ID) {
    ticket(id: $id) {
      id
      title
      remainingUses
      image
      createdAt
      updatedAt
      cart {
        user {
          member {
            name
            registration
            hasActiveMembership
            group
            whatsappUrl
          }
        }
      }
    }
  }
`;

type TicketData = {
  ticket: {
    id: string;
    title: string;
    remainingUses: number;
    image: string;
    cart: {
      user: {
        member: {
          name: string;
          registration: string;
          hasActiveMembership: boolean;
          group: string;
          whatsappUrl: string;
        };
      };
    };
  };
};

export default function Ticket() {
  const contentRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(contentRef);
  const circleSize = useBreakpointValue([175, 220]);

  const router = useRouter();
  const { id } = router.query;
  const { token } = useContext(AuthContext);
  const { data } = useQuery<TicketData>(GET_TICKET, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
    variables: {
      id,
    },
  });
  const [uQRl, setUQRl] = useState('');

  useEffect(() => {
    setUQRl(
      `http://${window.location.hostname}:${window.location.port}${router.asPath}`,
    );
  }, [router.asPath]);

  return (
    <Layout title="Ingresso" isHeaded={false} isFooted={false}>
      <Box ref={contentRef} maxW="xl" mx="auto">
        <Card borderRadius={0} position={'relative'}>
          <TicketCircles
            parentDimensions={dimensions}
            circleSize={circleSize as number}
          />

          <Box
            borderColor="green.200"
            borderStyle={'dashed'}
            borderWidth={2}
            minH="40vh"
            py={4}
            px={2}
            my={`${(circleSize as number) / 2}px`}
          >
            <PageHeading size="md">Interna (LOTE PROMOCIONAL)</PageHeading>
            <Box>
              <Heading size="xs" my={4}>
                DADOS DO CLIENTE
              </Heading>
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Td>
                        <Text>Nome:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>{data?.ticket?.cart.user.member.name}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Matrícula:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>
                          {data?.ticket?.cart.user.member.registration}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Turma:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>{data?.ticket?.cart.user.member.group}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Associação:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>
                          {data?.ticket?.cart.user.member
                            .hasActiveMembership ? (
                            <Badge colorScheme="green">Sócio Ativo</Badge>
                          ) : (
                            <Badge colorScheme="red">Sócio Inativo</Badge>
                          )}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Contato:</Text>
                      </Td>
                      <Td>
                        <HStack w="full" justify={'flex-end'}>
                          <CustomIconButton
                            aria-label="whatsapp"
                            icon={<FaWhatsapp size="20px" />}
                            size="xs"
                            onClick={() =>
                              window.open(
                                data?.ticket?.cart.user.member
                                  .whatsappUrl as string,
                                '_ blank',
                              )
                            }
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            <Box>
              <Heading size="xs" my={4}>
                DADOS DO INGRESSO
              </Heading>
              <TableContainer mb={4}>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Td>
                        <Text>Título:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>{data?.ticket?.title}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Usos restantes:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>{data?.ticket?.remainingUses}</Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Text>Status:</Text>
                      </Td>
                      <Td isNumeric>
                        <Text>PAGO</Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Center>
                <QRCode
                  value={uQRl}
                  size={128}
                  fgColor="#9aca3c"
                  bgColor="transparent"
                />
              </Center>
            </Box>
          </Box>
        </Card>
        <VoltarButton href="/areamembro/my-tickets" />
      </Box>
    </Layout>
  );
}
