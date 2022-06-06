import {
  Box,
  Center,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomChakraNextLink,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AiOutlineUnorderedList } from 'react-icons/ai';
import { GetStaticProps } from 'next';
import { Layout } from '@/components/templates';
import { MdShoppingCart } from 'react-icons/md';
import { ProdutoCard } from '@/components/molecules';
import React from 'react';
import client from '@/services/apollo-client';

const DIGITAL_ITEMS = gql`
  query getDigitalItems {
    digitalItems {
      objects {
        id
        name
        price
        image
        description
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

export type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
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
  const { data: produtos, loading } = useQuery<QueryData>(DIGITAL_ITEMS);

  return (
    <Layout title="Loja">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Loja</PageHeading>
        {loading && (
          <Center>
            <Spinner color="green" mx={'auto'} />
          </Center>
        )}
        <SimpleGrid
          columns={{ base: 1, md: 3, lg: 3 }}
          spacing={{ base: '8', lg: '2' }}
        >
          {produtos?.digitalItems.objects.map((product) => {
            return <ProdutoCard key={product.id} node={product} />;
          })}
        </SimpleGrid>
        {produtos?.digitalItems.objects.length === 0 && (
          <Text textAlign={'center'}>
            <em>Nenhum produto disponível para compra online no momento.</em>
          </Text>
        )}
        <Stack mt={10}>
          <CustomChakraNextLink href="/cart">
            <CustomButton
              colorScheme="gray"
              leftIcon={<MdShoppingCart size="25px" />}
            >
              Carrinho
            </CustomButton>
          </CustomChakraNextLink>
          <CustomChakraNextLink href="/loja/meus-pedidos">
            <CustomButton
              colorScheme="gray"
              leftIcon={<AiOutlineUnorderedList size="25px" />}
            >
              Meus pedidos
            </CustomButton>
          </CustomChakraNextLink>
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
