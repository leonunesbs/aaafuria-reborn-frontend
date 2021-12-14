import CustomButtom from '@/components/CustomButtom';
import { PixQRCode } from 'pix-react';
import { SimpleGrid } from '@chakra-ui/react';
import { CarrinhoData } from '@/pages/areadiretor/plantao/pagamento';

interface PixTabPanelProps {
  parentData: {
    data: CarrinhoData | undefined;
    onOpen: () => void;
  };
}

export const PixTabPanelContent = ({
  parentData: parentData,
}: PixTabPanelProps) => {
  return (
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
          identificador: `${parentData.data?.carrinho.id}`,
          valor: parseFloat(parentData.data?.carrinho.total),
          mensagem: `ID: ${parentData.data?.carrinho.id} - Matrícula: ${parentData.data?.carrinho.user.socio.matricula}`,
        }}
        imageSettings={{
          src: '/calango-verde-3.png',
          height: 100,
          width: 100,
          alt: 'Pix',
          excavate: false,
        }}
      />
      <CustomButtom onClick={parentData.onOpen}>Confirmar PIX</CustomButtom>
    </SimpleGrid>
  );
};
