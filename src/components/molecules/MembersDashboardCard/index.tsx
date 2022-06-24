import { AddMembershipDrawer, Card, MembersTable } from '..';
import {
  Box,
  HStack,
  Heading,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';

const MEMBERSHIP_PLANS = gql`
  query {
    allMembershipPlans {
      edges {
        node {
          id
          name
          membersCount
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
        membersCount: number;
        isActive: boolean;
      };
    }[];
  };
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MembersDashboardCardProps {}

function MembersDashboardCard({}: MembersDashboardCardProps) {
  const { green } = useContext(ColorContext);
  const membershipPlans = useQuery<MembershipPlans>(MEMBERSHIP_PLANS);

  return (
    <Stack spacing={4}>
      <Card>
        <HStack w="full" justify={'space-between'} mb={4}>
          <Box>
            <Heading size="md" color={green}>
              ASSOCIAÇÕES
            </Heading>
          </Box>
          {membershipPlans.data && (
            <AddMembershipDrawer
              membershipPlans={membershipPlans.data.allMembershipPlans.edges}
            />
          )}
        </HStack>
        <StatGroup>
          {membershipPlans.data?.allMembershipPlans.edges.map(
            ({ node: { id, name, membersCount } }) => (
              <Stat key={id}>
                <StatLabel>{name}</StatLabel>
                <StatNumber>{membersCount}</StatNumber>
              </Stat>
            ),
          )}
        </StatGroup>
      </Card>
      <Card>
        <Box>
          <Heading size="md" color={green}>
            MEMBROS
          </Heading>
        </Box>
        <MembersTable />
      </Card>
    </Stack>
  );
}

export default MembersDashboardCard;
