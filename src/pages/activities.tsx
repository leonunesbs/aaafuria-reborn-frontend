import { Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { ActivityCard } from '@/components/molecules';
import { AuthContext } from '@/contexts/AuthContext';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { useContext } from 'react';

const ALL_ACTIVITIES = gql`
  query allActivities {
    allActivities {
      id
      name
      schedules(isActive: true) {
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
        Authorization: `JWT ${token || ''}`,
      },
    },
  });

  return (
    <Layout
      title="Programação de atividades"
      desc="Participe de jogos, apresentações, treinos, ensaios e muito mais. Conheça o melhor da Fúria!"
    >
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

export default Activities;
