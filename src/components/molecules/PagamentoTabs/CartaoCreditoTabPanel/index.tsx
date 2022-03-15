import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  chakra,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { CustomIconButton } from '@/components/atoms';
import { MdCopyAll } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { parseCookies } from 'nookies';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CartaoCreditoTabPanelProps {
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

export const CartaoCreditoTabPanel = ({
  checkoutId = '',
}: CartaoCreditoTabPanelProps) => {
  const ChakraQRCode = chakra(QRCode);
  const toast = useToast();
  const [url, setUrl] = useState('');
  const { hasCopied, onCopy } = useClipboard(url);

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

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: 'Copiado',
        description: 'QR Code copiado para a área de transferência.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  }, [hasCopied, toast]);
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
              pr="4.5rem"
              value={url}
              readOnly
              focusBorderColor="green.500"
            />
            <InputRightElement>
              <CustomIconButton
                aria-label="copy"
                icon={<MdCopyAll size="25px" />}
                onClick={onCopy}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </SimpleGrid>
    </Skeleton>
  );
};
