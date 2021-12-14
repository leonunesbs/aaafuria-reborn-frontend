import CustomButtom from '@/components/CustomButtom';
import CustomChakraNextLink from '@/components/CustomChakraNextLink';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import QRCode from 'react-qr-code';
import { Card } from '@/components/Card';
import { MdArrowLeft, MdCopyAll } from 'react-icons/md';
import { PixQRCode } from 'pix-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  chakra,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';

const ChakraQRCode = chakra(QRCode);

function Pagamento() {
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

          <Tabs isLazy align="center" colorScheme="green" mt={6} isFitted>
            <TabList>
              <Tab>PIX</Tab>
              <Tab>Cartão de crédito</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
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
              </TabPanel>
              <TabPanel>
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
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
        <CustomChakraNextLink href={'/areadiretor/plantao'}>
          <CustomButtom
            leftIcon={<MdArrowLeft size="25px" />}
            colorScheme="red"
            mt={4}
          >
            Voltar
          </CustomButtom>
        </CustomChakraNextLink>
      </Box>
    </Layout>
  );
}

export default Pagamento;
