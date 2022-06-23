import {
  CustomButton,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import {
  Badge,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useCallback, useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdSend, MdShoppingCart } from 'react-icons/md';

import { ProdutoCard } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import client from '@/services/apollo-client';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { AiOutlineUnorderedList } from 'react-icons/ai';

const DIGITAL_ITEMS = gql`
  query getDigitalItems {
    digitalItems {
      objects {
        id
        name
        price
        image
        description
        membershipExclusive
        membershipPrice
        staffPrice
        variations {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const GET_MEMBER = gql`
  query ($registration: String) {
    memberByRegistration(registration: $registration) {
      id
      name
      hasActiveMembership
    }
  }
`;

export type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  membershipExclusive: boolean;
  membershipPrice: number;
  staffPrice: number;
  variations: {
    edges: {
      node: {
        id: string;
        name: string;
      };
    }[];
  };
};

type QueryData = {
  digitalItems: {
    objects: ProductType[];
  };
};

function Loja() {
  const router = useRouter();
  const { data: produtos, loading } = useQuery<QueryData>(DIGITAL_ITEMS);
  const { user, token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);

  const [clientRegistration, setClientRegistration] = useState<string | null>(
    null,
  );

  const { handleSubmit, register } = useForm<{
    registration: string;
  }>();

  const {
    data: member,
    loading: loadingMember,
    refetch: refetchMember,
  } = useQuery<{
    memberByRegistration: {
      id: string;
      name: string;
      hasActiveMembership: boolean;
    };
  }>(GET_MEMBER, {
    context: {
      headers: {
        Authorization: token ? `JWT ${token}` : '',
      },
    },
  });

  const onSubmit: SubmitHandler<{ registration: string }> = useCallback(
    (data: { registration: string }) => {
      refetchMember({ registration: data.registration });
      setClientRegistration(data.registration);
    },
    [refetchMember],
  );

  return (
    <Layout title="Loja">
      <Box>
        <PageHeading>Loja</PageHeading>
        {loading && (
          <Center>
            <Spinner color={green} mx={'auto'} />
          </Center>
        )}
        <Box mb={4}>
          {user?.isStaff && (
            <FormControl>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormLabel htmlFor="registration">
                  <Text fontSize={'xs'}>
                    Cliente: {member?.memberByRegistration?.name}
                    {member?.memberByRegistration?.hasActiveMembership && (
                      <Badge colorScheme={'green'} ml={2}>
                        Sócio
                      </Badge>
                    )}
                  </Text>
                </FormLabel>
                <InputGroup maxW="2xs" size={'sm'}>
                  <Input
                    placeholder="Matrícula"
                    focusBorderColor={green}
                    rounded="md"
                    {...register('registration')}
                  />
                  <InputRightElement>
                    <CustomIconButton
                      type="submit"
                      aria-label="set"
                      isLoading={loadingMember}
                      icon={<MdSend size="20px" />}
                    />
                  </InputRightElement>
                </InputGroup>
              </form>
            </FormControl>
          )}
        </Box>
        <SimpleGrid
          columns={{ base: user?.isStaff ? 2 : 1, md: 3, lg: 3 }}
          spacing={2}
        >
          {produtos?.digitalItems.objects.map((product) => {
            return (
              <ProdutoCard
                key={product.id}
                node={product}
                clientRegistration={clientRegistration}
              />
            );
          })}
        </SimpleGrid>
        {produtos?.digitalItems.objects.length === 0 && (
          <Text textAlign={'center'}>
            <em>Nenhum produto disponível para compra online no momento.</em>
          </Text>
        )}
        <Stack mt={10}>
          <CustomButton
            colorScheme="gray"
            leftIcon={<MdShoppingCart size="25px" />}
            onClick={() => router.push('/cart')}
          >
            Carrinho
          </CustomButton>
          <CustomButton
            colorScheme="gray"
            leftIcon={<AiOutlineUnorderedList size="25px" />}
            onClick={() => router.push('/loja/meus-pedidos')}
          >
            Meus pedidos
          </CustomButton>
          <VoltarButton href="/" />
        </Stack>
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({}) => {
  return await client
    .query({
      query: DIGITAL_ITEMS,
    })
    .then(({ data }) => {
      return {
        props: {
          produtos: data,
        },
        revalidate: 60,
      };
    });
};

export default Loja;
