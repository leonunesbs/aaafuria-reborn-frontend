import CustomButtom from '@/components/CustomButtom';
import { gql, useMutation } from '@apollo/client';
import {
  Box,
  chakra,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { parseCookies } from 'nookies';
import { useRef, useCallback, useState, useEffect } from 'react';
import { MdCopyAll } from 'react-icons/md';
import QRCode from 'react-qr-code';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CartaoCreditoTabPanelProps {
  checkoutId: string | undefined;
}

const STRIPE_CHECKOUT_PLANTAO = gql`
  mutation stripeCheckoutPlantao($checkoutId: ID!) {
    stripeCheckoutPlantao(checkoutId: $checkoutId) {
      ok
      carrinho {
        stripeShortCheckoutUrl
      }
    }
  }
`;

export const CartaoCreditoTabPanelContent = ({
  checkoutId = '',
}: CartaoCreditoTabPanelProps) => {
  const ChakraQRCode = chakra(QRCode);
  const toast = useToast();
  const [url, setUrl] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const [stripeCheckoutPlantao, { loading }] = useMutation(
    STRIPE_CHECKOUT_PLANTAO,
    {
      context: {
        headers: {
          authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
        },
      },
      variables: { checkoutId },
    },
  );

  const handleCopy = useCallback(() => {
    inputRef.current?.select();
    document.execCommand('copy');

    toast({
      title: 'Copiado',
      description: 'QR Code copiado para a área de transferência.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  useEffect(() => {
    stripeCheckoutPlantao().then(({ data }) => {
      setUrl(data.stripeCheckoutPlantao.carrinho.stripeShortCheckoutUrl);
    });
  }, [stripeCheckoutPlantao]);

  return (
    <Skeleton isLoaded={!loading}>
      <SimpleGrid
        mt={10}
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: '8', lg: '2' }}
        mx="auto"
        justifyItems="center"
        alignItems="center"
      >
        <ChakraQRCode value={url} size={256} fgColor="green" />
        <Box>
          <InputGroup size="lg">
            <Input
              ref={inputRef}
              pr="4.5rem"
              value={url}
              readOnly
              focusBorderColor="green.500"
            />
            <InputRightElement width="4.5rem">
              <CustomButtom w="40px" size="xs" onClick={handleCopy}>
                <MdCopyAll size="25px" />
              </CustomButtom>
            </InputRightElement>
          </InputGroup>
        </Box>
      </SimpleGrid>
    </Skeleton>
  );
};
