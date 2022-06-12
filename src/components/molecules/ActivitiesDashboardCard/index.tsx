import {
  Box,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '..';
import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';

const ALL_ACTIVITIES = gql`
  query allActivities {
    allActivities {
      id
      name
      ytdSchedulesCount
      futureSchedulesCount
      expectedCost
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActivitiesDashboardCardProps {}

type ActivitiesData = {
  allActivities: {
    id: string;
    name: string;
    ytdSchedulesCount: number;
    futureSchedulesCount: number;
    expectedCost: number;
  }[];
};

function ActivitiesDashboardCard({}: ActivitiesDashboardCardProps) {
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data } = useQuery<ActivitiesData>(ALL_ACTIVITIES, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  return (
    <Card>
      <HStack mb={4} w="full" justify="space-between">
        <Heading size="md" color={green}>
          ATIVIDADES
        </Heading>
      </HStack>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Atividade</Th>
              <Th isNumeric>Programações no ano</Th>
              <Th isNumeric>Programações agendadas</Th>
              <Th isNumeric>Custo esperado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.allActivities?.map((activity) => (
              <Tr key={activity.id}>
                <Td>{activity.name}</Td>
                <Td isNumeric>{activity.ytdSchedulesCount}</Td>
                <Td isNumeric>{activity.futureSchedulesCount}</Td>
                <Td isNumeric>R$ ****</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot visibility={'hidden'}>
            <Tr>
              <Td colSpan={4} isNumeric>
                <Box>
                  <strong>
                    Custo previsto: R$
                    {data?.allActivities?.reduce((acc, activity) => {
                      return acc + activity.expectedCost;
                    }, 0)}
                  </strong>
                </Box>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ActivitiesDashboardCard;
