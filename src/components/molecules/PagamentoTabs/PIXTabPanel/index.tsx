import { CustomButtom } from '@/components/atoms';
import { CarrinhoData } from '@/pages/areadiretor/plantao/pagamento';
import { gql, useMutation } from '@apollo/client';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import * as gtag from 'lib/gtag';
import router from 'next/router';
import { parseCookies } from 'nookies';
import { PixQRCode } from 'pix-react';
import { useCallback } from 'react';

export interface PixTabPanelProps {
  parentData: {
    data: CarrinhoData | undefined;
  };
}

const CHECKOUT_PLANTAO = gql`
  mutation checkoutPlantao($checkoutId: ID!, $formaPagamento: String!) {
    checkoutPlantao(checkoutId: $checkoutId, formaPagamento: $formaPagamento) {
      ok
    }
  }
`;

export const PixTabPanel = ({ parentData: parentData }: PixTabPanelProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [checkoutPlantao] = useMutation(CHECKOUT_PLANTAO, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
    variables: {
      checkoutId: parentData.data?.carrinho.id,
      formaPagamento: 'pix',
    },
  });

  const handleConfirmar = useCallback(() => {
    checkoutPlantao();
    onClose();
    toast({
      title: 'Pagamento confirmado',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-left',
    });
    gtag.event({
      action: 'purchase',
      category: 'ecommerce',
      label: parentData.data?.carrinho.user.socio.matricula ?? '',
      value: 1,
      items: parentData.data?.carrinho.produtos.edges.map(({ node }) => ({
        id: node.id,
        name: node.produto.nome,
        price: node.getPrice,
        quantity: node.quantidade,
      })),
    });
    router.push('/areadiretor/plantao/');
  }, [checkoutPlantao, onClose, parentData.data, toast]);

  const chavePix = '02544977302';
  return (
    <>
      <SimpleGrid
        mt={10}
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: '8', lg: '2' }}
        mx="auto"
        justifyItems="center"
        alignItems="center"
      >
        <PixQRCode
          size={256}
          renderAs="svg"
          includeMargin
          fgColor="gray"
          pixParams={{
            chave: chavePix,
            recebedor: 'Iago Antunes Macedo de Souza',
            cidade: 'Teresina',
            identificador: `${parentData.data?.carrinho.id}`,
            valor: parseFloat(parentData.data?.carrinho.total),
            mensagem: `ID: ${parentData.data?.carrinho.id} - Matrícula: ${parentData.data?.carrinho.user.socio.matricula}`,
          }}
          imageSettings={{
            src: `${process.env.PUBLIC_AWS_URI}/calango-verde-3.png`,
            height: 100,
            width: 100,
            alt: 'Pix',
            excavate: false,
          }}
        />
        <CustomButtom onClick={onOpen}>Confirmar pagamento</CustomButtom>
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar pagamento?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>PIX</ModalBody>

          <ModalFooter>
            <CustomButtom color="red" onClick={onClose}>
              Fechar
            </CustomButtom>
            <CustomButtom mr={3} onClick={handleConfirmar}>
              Confimar
            </CustomButtom>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
