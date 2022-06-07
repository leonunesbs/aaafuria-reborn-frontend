import {
  AddMembershipDrawer,
  AddPaymentDrawer,
  Card,
  PaymentsTable,
} from '@/components/molecules';
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const MEMBERSHIP_PLANS = gql`
  query {
    allMembershipPlans {
      edges {
        node {
          id
          name
          count
          isActive
        }
      }
    }
  }
`;
type MembershipPlans = {
  allMembershipPlans: {
    edges: {
      node: {
        id: string;
        name: string;
        count: number;
        isActive: boolean;
      };
    }[];
  };
};

function AreaDiretor() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useContext(AuthContext);

  const membershipPlans = useQuery<MembershipPlans>(MEMBERSHIP_PLANS);

  useEffect(() => {
    if (user?.isStaff === false) {
      toast({
        title: 'Área restrita',
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/');
    }
  }, [router, toast, user?.isStaff]);

  return (
    <Layout title="Área do Diretor">
      <Box maxW="7xl" mx="auto">
        <PageHeading>Área do Diretor</PageHeading>
        <Grid
          templateAreas={[
            `"members"
          "activities"
          "payments"`,
            `"members activities"
          "payments activities"`,
          ]}
          gridTemplateRows={['repeat(100%, 3)', '1fr 4fr']}
          gridTemplateColumns={['100%', '40% 60%']}
          gap="2"
        >
          <GridItem area={'members'}>
            <Card>
              <HStack w="full" justify={'space-between'} mb={4}>
                <Heading size="sm">ASSOCIAÇÕES</Heading>
                {membershipPlans.data && (
                  <AddMembershipDrawer
                    membershipPlans={
                      membershipPlans.data.allMembershipPlans.edges
                    }
                  />
                )}
              </HStack>
              <StatGroup>
                {membershipPlans.data?.allMembershipPlans.edges.map(
                  ({ node: { id, name, count } }) => (
                    <Stat key={id}>
                      <StatLabel>{name}</StatLabel>
                      <StatNumber>{count}</StatNumber>
                    </Stat>
                  ),
                )}
              </StatGroup>
            </Card>
          </GridItem>
          <GridItem area={'activities'}>
            <Card>
              <Heading size="sm">ATIVIDADES</Heading>
              <Box>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Modalidade</Th>
                      <Th isNumeric>Treinos no ano</Th>
                      <Th isNumeric>Treinos agendados</Th>
                      <Th isNumeric>Custo esperado</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td colSpan={4} textAlign="center">
                        Em construção
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Card>
          </GridItem>
          <GridItem area={'payments'}>
            <Card>
              <HStack mb={4} w="full" justify={'space-between'}>
                <Heading size="sm">PAGAMENTOS</Heading>
                <AddPaymentDrawer />
              </HStack>
              <PaymentsTable pageSize={5} />
            </Card>
          </GridItem>
        </Grid>
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

export default AreaDiretor;
