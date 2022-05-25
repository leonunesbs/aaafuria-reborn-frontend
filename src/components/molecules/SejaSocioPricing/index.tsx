import { gql, useQuery } from '@apollo/client';

import { ISejaSocioPricing } from './ISejaSocioPricing';
import { SejaSocioPricingCard } from '@/components/molecules';
import { SimpleGrid } from '@chakra-ui/react';

const ALL_MEMBERSHIP_PLANS = gql`
  query {
    allMembershipPlans {
      edges {
        node {
          id
          title
          name
          price
          ref
          refId
        }
      }
    }
  }
`;

export type MembershipPlan = {
  id: string;
  title: string;
  name: string;
  price: number;
  ref: string;
  refId: string;
};

export const SejaSocioPricing = ({}: ISejaSocioPricing) => {
  const { data: membershipPlans } = useQuery<{
    allMembershipPlans: { edges: { node: MembershipPlan }[] };
  }>(ALL_MEMBERSHIP_PLANS);

  return (
    <SimpleGrid
      columns={{ base: 1, lg: 3 }}
      spacing={{ base: '8', lg: '2' }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
    >
      {membershipPlans?.allMembershipPlans?.edges.map(
        ({ node: membershipPlan }) => (
          <SejaSocioPricingCard
            key={membershipPlan.id}
            membershipPlan={membershipPlan}
          />
        ),
      )}
    </SimpleGrid>
  );
};
