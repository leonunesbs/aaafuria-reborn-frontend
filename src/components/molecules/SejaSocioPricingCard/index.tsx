import { CustomButton, PageHeading } from '@/components/atoms';
import { List, ListIcon, ListItem, Stack } from '@chakra-ui/react';
import { MdLogin, MdPayment } from 'react-icons/md';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '..';
import { ColorContext } from '@/contexts/ColorContext';
import { HiCheckCircle } from 'react-icons/hi';
import { ISejaSocioPricingCard } from './ISejaSocioPricingCard';
import { useRouter } from 'next/router';

const CHECKOUT_MEMBERSHIP = gql`
  mutation checkoutMembership($planId: ID!, $ref: String!) {
    checkoutMembership(planId: $planId, ref: $ref) {
      ok
      checkoutUrl
    }
  }
`;

interface Planos {
  [key: string]: string[];
  Mensal: string[];
  Semestral: string[];
  Anual: string[];
}

const planos: Planos = {
  Mensal: [
    '1 mês de acesso com renovação automática',
    'Participe dos treinos de todas as modalidades',
    'Participe dos ensaios da Carabina',
    'Ganhe desconto em produtos e eventos',
    'Acumule Calangos para desconto no INTERMED!',
    'Desconto no BONDE DO AHAM',
  ],
  Semestral: [
    'TODOS OS BENEFÍCIOS DO SÓCIO FÚRIA',
    'Acesso durante o semestre atual com renovação automática',
    'Participe dos treinos de todas as modalidades',
    'Participe dos ensaios da Carabina',
    'Ganhe desconto em produtos e eventos',
    'Desconto no INTERMED!',
    'Desconto no BONDE DO AHAM',
  ],
  Anual: [
    'TODOS OS BENEFÍCIOS DO SÓCIO FÚRIA',
    'Acesso durante o semestre atual e o próximo semestre com renovação automática',
    'Participe dos treinos de todas as modalidades',
    'Participe dos ensaios da Carabina',
    'Ganhe desconto em produtos e eventos',
    'Desconto no INTERMED',
    'Desconto no BONDE DO AHAM',
  ],
};

export const SejaSocioPricingCard = ({
  membershipPlan,
}: ISejaSocioPricingCard) => {
  const router = useRouter();
  const { green } = useContext(ColorContext);
  const { isAuthenticated, token } = useContext(AuthContext);

  const [checkoutMembership, { loading }] = useMutation(CHECKOUT_MEMBERSHIP);
  const handleCheckout = useCallback(
    async (planId: string, ref: string) => {
      await checkoutMembership({
        variables: {
          planId,
          ref,
        },
        context: {
          headers: {
            authorization: `JWT ${token}`,
          },
        },
      }).then(({ data }) => {
        if (data.checkoutMembership.ok) {
          router.push(data.checkoutMembership.checkoutUrl);
        }
      });
    },
    [checkoutMembership, router, token],
  );
  return (
    <Card>
      <Stack>
        <PageHeading>{membershipPlan.title}</PageHeading>
        <List spacing="4" mx="auto">
          {planos[membershipPlan.name].map((value, index) => (
            <ListItem fontWeight="medium" key={index}>
              <ListIcon
                fontSize="xl"
                as={HiCheckCircle}
                marginEnd={2}
                color={green}
              />
              {value}
            </ListItem>
          ))}
        </List>
        {isAuthenticated ? (
          <CustomButton
            isLoading={loading}
            onClick={() =>
              handleCheckout(membershipPlan.id, membershipPlan.ref)
            }
            leftIcon={<MdPayment size="20px" />}
          >
            Ir ao pagamento
          </CustomButton>
        ) : (
          <CustomButton
            onClick={() => router.push('/entrar?after=/sejasocio')}
            leftIcon={<MdLogin size="20px" />}
          >
            Entrar
          </CustomButton>
        )}
      </Stack>
    </Card>
  );
};
