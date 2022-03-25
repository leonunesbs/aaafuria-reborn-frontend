import {
  Box,
  FormControl,
  FormLabel,
  Skeleton,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomChakraNextLink,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AiOutlineLink } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { useRouter } from 'next/router';

type FileType = {
  file: {
    id: string;
    title: string;
    content: string;
    file: string;
    postedAt: string;
    author: {
      nome: string;
    };
  };
};

const GET_FILE = gql`
  query getFile($id: ID!) {
    file(id: $id) {
      id
      title
      content
      postedAt
      author {
        nome
      }
      file
    }
  }
`;

function Arquivo() {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const { id = '0' } = router.query;
  const green = useColorModeValue('green.600', 'green.200');

  const { data, loading } = useQuery<FileType>(GET_FILE, {
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
    <Layout title={data?.file.title as string} desc={data?.file.content}>
      <Box maxW="5xl" mx={'auto'}>
        <PageHeading>{data?.file.title}</PageHeading>
        <Skeleton isLoaded={!loading}>
          <Card>
            <Stack>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={data?.file.content}
                  focusBorderColor={green}
                  readOnly
                />
              </FormControl>
              {data?.file.file && (
                <FormControl>
                  <FormLabel>Anexo</FormLabel>
                  <CustomChakraNextLink
                    href={(data?.file.file as string) || '#'}
                    chakraLinkProps={{
                      target: '_blank',
                    }}
                  >
                    <CustomButton
                      maxW="3xs"
                      leftIcon={<AiOutlineLink size="25px" />}
                    >
                      Visualizar anexo
                    </CustomButton>
                  </CustomChakraNextLink>
                </FormControl>
              )}
            </Stack>
            <Text textAlign={'right'} mt={4} isTruncated>
              <strong>Criado em:</strong>{' '}
              <Text as="time" dateTime={data?.file.postedAt}>
                {new Date(data?.file.postedAt as string).toLocaleString(
                  'pt-BR',
                  {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'America/Sao_Paulo',
                  },
                )}
              </Text>
            </Text>
          </Card>
        </Skeleton>
        <VoltarButton href="/arquivos" />
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/entrar?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
};

export default Arquivo;
