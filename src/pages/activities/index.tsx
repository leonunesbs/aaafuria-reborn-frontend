import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { ActivityCard } from '@/components/molecules';
import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
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
  const { green } = useContext(ColorContext);
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
      <Box mx="auto">
        <Box mb={6}>
          <PageHeading>Programação de atividades</PageHeading>
          <Text textAlign={'center'} size="lg">
            Junte-se aos nossos{' '}
            <Text as="span" textColor={green}>
              times de campeões
            </Text>
            !
          </Text>
        </Box>
        <Grid
          gap={4}
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(3, 1fr)',
            'repeat(3, 1fr)',
            'repeat(4, 1fr)',
          ]}
        >
          {data?.allActivities.map((activity) => (
            <GridItem key={activity.id}>
              <ActivityCard activity={activity} refetch={refetch} />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}

export default Activities;
