import { Card } from '@/components/Card';
import CustomButtom from '@/components/CustomButtom';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import {
  Box,
  chakra,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { PixQRCode } from 'pix-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { MdClose, MdCopyAll } from 'react-icons/md';
import QRCode from 'react-qr-code';

const ChakraQRCode = chakra(QRCode);

function Qrcode() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [url, setUrl] = useState('');
  const { id, u, total, m: matricula }: any = router.query;
  const toast = useToast();

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
    if (!id || !u || !total || !matricula) {
      return;
    }
  }, [total, matricula, u, id]);

  useEffect(() => {
    setUrl(`${u}`);
  }, [u]);

  return (
    <Layout>
      <Box maxW="2xl" mx="auto">
        <PageHeading>Pagamento</PageHeading>
        <Card>
          <Text textAlign={'center'}>
            <b>Matrícula:</b> {matricula}
          </Text>
          <Text textAlign={'center'}>
            <b>Total:</b> R$ {total}
          </Text>
          <SimpleGrid
            mt={10}
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: '8', lg: '2' }}
            mx="auto"
            justifyItems="center"
            alignItems="center"
          >
            <ChakraQRCode value={url} size={256} fgColor="blue" />
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
          <SimpleGrid
            mt={10}
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: '8', lg: '2' }}
            mx="auto"
            justifyItems="center"
            alignItems="center"
          >
            <Box>
              <Text>PIX</Text>
            </Box>
            <PixQRCode
              size={256}
              renderAs="svg"
              includeMargin
              fgColor="gray"
              pixParams={{
                chave: 'leonunesbs@gmail.com',
                recebedor: '@aaafuria',
                cidade: 'Teresina',
                identificador: id,
                valor: parseFloat(total),
                mensagem: `ID: ${id} - Matrícula: ${matricula}`,
              }}
              imageSettings={{
                src: '/calango-verde-3.png',
                height: 100,
                width: 100,
                alt: 'Pix',
                excavate: false,
              }}
            />
          </SimpleGrid>
        </Card>
        <CustomButtom
          leftIcon={<MdClose size="25px" />}
          colorScheme="red"
          mt={4}
          onClick={() => close()}
        >
          Fechar
        </CustomButtom>
      </Box>
    </Layout>
  );
}

export default Qrcode;
