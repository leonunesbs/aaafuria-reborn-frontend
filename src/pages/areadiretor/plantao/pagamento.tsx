import CustomButtom from '@/components/CustomButtom';
import CustomChakraNextLink from '@/components/CustomChakraNextLink';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import { Card } from '@/components/Card';
import { CartaoCreditoTabPanelContent } from '@/components/pagamento/CartaoCreditoTabPanelContent';
import { gql, useQuery } from '@apollo/client';
import { MdArrowLeft } from 'react-icons/md';
import { PixTabPanelContent } from '@/components/pagamento/PIXTabPanelContent';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { AuthContext } from '@/contexts/AuthContext';

const GET_CARRINHO = gql`
  query getCarrinho($id: ID!) {
    carrinho(id: $id) {
      id
      user {
        socio {
          matricula
          nome
        }
      }
      total
    }
  }
`;

export type CarrinhoData = {
  carrinho: {
    id: string;
    user: {
      socio: {
        matricula: string;
        nome: string;
      };
    };
    total: any;
  };
};

function Pagamento() {
  const { isStaff } = useContext(AuthContext);

  const router = useRouter();
  const { id = '' }: any = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = useQuery<CarrinhoData>(GET_CARRINHO, {
    variables: {
      id,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (!id) {
      return;
    }
  }, [id]);

  useEffect(() => {
    isStaff === false && router.replace('/');
  }, [isStaff, router]);

  return (
    <Layout>
      <Box maxW="2xl" mx="auto">
        <PageHeading>Pagamento</PageHeading>
        <Card>
          <Text textAlign={'center'}>
            <b>Matrícula: </b> {data?.carrinho.user.socio.matricula}
          </Text>
          <Text textAlign={'center'}>
            <b>Total: </b> R$ {data?.carrinho.total}
          </Text>

          <Tabs isLazy align="center" colorScheme="green" mt={6} isFitted>
            <TabList>
              <Tab>PIX</Tab>
              <Tab>Cartão de crédito</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <PixTabPanelContent
                  parentData={{
                    data,
                    onOpen,
                  }}
                />
              </TabPanel>
              <TabPanel>
                <CartaoCreditoTabPanelContent checkoutId={data?.carrinho.id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar pagamento?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Teste</ModalBody>

            <ModalFooter>
              <CustomButtom color="red" onClick={onClose}>
                Fechar
              </CustomButtom>
              <CustomButtom mr={3}>Confimar</CustomButtom>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <CustomChakraNextLink href={'/areadiretor/plantao'}>
          <CustomButtom
            leftIcon={<MdArrowLeft size="25px" />}
            colorScheme="red"
            mt={4}
          >
            Voltar ao plantão
          </CustomButtom>
        </CustomChakraNextLink>
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
    props: {},
  };
};

export default Pagamento;
