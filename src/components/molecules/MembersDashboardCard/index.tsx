import { AddMembershipDrawer, Card } from '..';
import {
  Box,
  HStack,
  Heading,
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MembersDashboardCardProps {}

function MembersDashboardCard({}: MembersDashboardCardProps) {
  const { green } = useContext(ColorContext);
  const membershipPlans = useQuery<MembershipPlans>(MEMBERSHIP_PLANS);

  return (
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
          ({ node: { id, name, count } }) => (
            <Stat key={id}>
              <StatLabel>{name}</StatLabel>
              <StatNumber>{count}</StatNumber>
            </Stat>
          ),
        )}
      </StatGroup>
    </Card>
  );
}

export default MembersDashboardCard;
