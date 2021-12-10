import { Card } from '@/components/Card';
import CustomButtom from '@/components/CustomButtom';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

function Qrcode() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const { u } = router.query;

  useEffect(() => {
    setUrl(`${u}`);
  }, [u]);

  return (
    <Layout>
      <Box maxW="6xl" mx="auto">
        <PageHeading>Carrinho Plantão</PageHeading>
        <Card>
          <QRCode value={url} size={256} />
          <a href={url}>Link</a>
        </Card>
        <CustomButtom colorScheme="red" mt={4} onClick={() => window.close()}>
          Voltar
        </CustomButtom>
      </Box>
    </Layout>
  );
}

export default Qrcode;
