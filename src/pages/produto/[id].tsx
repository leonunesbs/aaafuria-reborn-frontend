import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Box } from '@chakra-ui/react';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { useContext } from 'react';
import { useRouter } from 'next/router';

type ProdutoType = {
  produto: {
    id: string;
    nome: string;
    descricao: string;
  };
};

const GET_PRODUTO = gql`
  query getProduto($id: ID!) {
    produto(id: $id) {
      id
      nome
      descricao
    }
  }
`;

function Produto() {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const { id = '0' } = router.query;

  const { data } = useQuery<ProdutoType>(GET_PRODUTO, {
    variables: {
      id: id as string,
    },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Layout title={data?.produto.nome as string} desc={data?.produto.descricao}>
      <Box maxW="5xl" mx={'auto'}>
        <PageHeading>{data?.produto.nome}</PageHeading>
      </Box>
    </Layout>
  );
}

export default Produto;
