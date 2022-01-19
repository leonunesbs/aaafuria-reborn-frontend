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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import router from 'next/router';
import { parseCookies } from 'nookies';
import { useCallback } from 'react';

const CHECKOUT_PLANTAO = gql`
  mutation checkoutPlantao($checkoutId: ID!, $formaPagamento: String!) {
    checkoutPlantao(checkoutId: $checkoutId, formaPagamento: $formaPagamento) {
      ok
    }
  }
`;

interface EspecieTabPanelProps {
  parentData: {
    data: CarrinhoData | undefined;
  };
}

export const EspecieTabPanelContent = ({
  parentData,
}: EspecieTabPanelProps) => {
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
      router.push('/areadiretor/plantao/');
    });
    onClose();
  }, [checkoutPlantao, onClose, toast]);

  return (
    <>
      <CustomButtom onClick={onOpen}>Confirmar pagamento</CustomButtom>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar pagamento?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Espécie</ModalBody>

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
