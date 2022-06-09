import { Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { ActivityCard } from '@/components/molecules';
import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { parseCookies } from 'nookies';
import { useContext } from 'react';

const ALL_ACTIVITIES = gql`
  query allActivities {
    allActivities {
      id
      name
      schedules {
        edges {
          node {
            id
            status
            description
            startDate
            location
            minParticipants
            maxParticipants
            confirmedCount
            currentUserConfirmed
            tags
          }
        }
      }
    }
  }
`;

export type Activity = {
  id: string;
  status: string;
  description: string;
  startDate: string;
  location: string;
  minParticipants: number;
  maxParticipants: number;
  confirmedCount: number;
  currentUserConfirmed: boolean;
  tags: string[];
};

type ActivitiesData = {
  allActivities: {
    id: string;
    name: string;
    schedules: {
      edges: {
        node: Activity;
      }[];
    };
  }[];
};

function Activities() {
  const { token } = useContext(AuthContext);
  const { data, refetch } = useQuery<ActivitiesData>(ALL_ACTIVITIES, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Layout title="Atividades">
      <Box mx="auto" maxW="8xl">
        <Box mb={6}>
          <PageHeading>O MELHOR DA FÚRIA</PageHeading>
          <Text textAlign={'center'} size="lg">
            Junte-se aos nossos times de campeões!
          </Text>
        </Box>
        <Wrap spacing={4} justify="center">
          {data?.allActivities.map((activity) => (
            <WrapItem key={activity.id} maxW={['md', 'xs']} w="full">
              <ActivityCard activity={activity} refetch={refetch} />
            </WrapItem>
          ))}
        </Wrap>
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

export default Activities;
