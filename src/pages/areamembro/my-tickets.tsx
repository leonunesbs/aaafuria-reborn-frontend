import { Box, HStack, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { CustomChakraNextLink, PageHeading } from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useContext } from 'react';

const GET_MY_TICKETS = gql`
  query myTickets {
    myTickets {
      id
      title
      image
      remainingUses
      createdAt
      updatedAt
    }
  }
`;

type TicketsData = {
  myTickets: {
    id: string;
    title: string;
    image: string;
    remainingUses: number;
  }[];
};

function MyTickets() {
  const { token } = useContext(AuthContext);
  const { data } = useQuery<TicketsData>(GET_MY_TICKETS, {
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });
  return (
    <Layout title="Meus ingressos">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Meus ingressos</PageHeading>
        <Card>
          <SimpleGrid columns={[1, 2]} spacing={4}>
            {data?.myTickets.map((ticket) => (
              <Card key={ticket.id}>
                <HStack align={'flex-start'}>
                  <Box boxSize={['90px', '120px']}>
                    <Image
                      src={'/lote-intermed.png'}
                      alt={'teste'}
                      rounded={'2xl'}
                      draggable={false}
                      objectFit="contain"
                    />
                  </Box>
                  <Box justifyContent={'flex-start'}>
                    <Text textTransform={'uppercase'} fontSize={['xs', 'md']}>
                      {ticket.title}
                    </Text>
                    <Text fontSize={'xx-small'} fontStyle="italic">
                      Usos restantes:
                      <Text as="span"> {ticket.remainingUses}</Text>
                    </Text>
                    <CustomChakraNextLink
                      href={`/store/tickets/${ticket.id}`}
                      chakraLinkProps={{
                        fontSize: 'xs',
                        textColor: 'green.500',
                        _dark: {
                          textColor: 'green.200',
                        },
                      }}
                    >
                      Ver ingresso
                    </CustomChakraNextLink>
                  </Box>
                </HStack>
              </Card>
            ))}
          </SimpleGrid>
        </Card>
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

export default MyTickets;
