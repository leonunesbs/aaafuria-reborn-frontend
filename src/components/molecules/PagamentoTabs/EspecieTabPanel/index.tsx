import * as gtag from 'lib/gtag';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { gql, useMutation } from '@apollo/client';

import { CarrinhoData } from '@/pages/areadiretor/plantao/pagamento';
import { CustomButton } from '@/components/atoms';
import { parseCookies } from 'nookies';
import router from 'next/router';
import { useCallback } from 'react';

const CHECKOUT_PLANTAO = gql`
  mutation checkoutPlantao($checkoutId: ID!, $formaPagamento: String!) {
    checkoutPlantao(checkoutId: $checkoutId, formaPagamento: $formaPagamento) {
      ok
    }
  }
`;

export interface EspecieTabPanelProps {
  parentData: {
    data: CarrinhoData | undefined;
  };
}

export const EspecieTabPanel = ({ parentData }: EspecieTabPanelProps) => {
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
      formaPagamento: 'especie',
    },
  });

  const handleConfirmar = useCallback(async () => {
    await checkoutPlantao().then(() => {
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
        value: parentData.data?.carrinho.total ?? 0,
        items: parentData.data?.carrinho.produtos.edges.map(({ node }) => ({
          id: node.id,
          name: node.produto.nome,
          price: node.getPrice,
          quantity: node.quantidade,
        })),
      });
      router.push('/areadiretor/plantao');
    });
    onClose();
  }, [checkoutPlantao, onClose, parentData.data, toast]);

  return (
    <>
      <CustomButton onClick={onOpen}>Confirmar pagamento</CustomButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar pagamento?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Espécie</ModalBody>

          <ModalFooter>
            <CustomButton color="red" onClick={onClose}>
              Fechar
            </CustomButton>
            <CustomButton mr={3} onClick={handleConfirmar}>
              Confimar
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
