import {
  Alert,
  AlertIcon,
  Collapse,
  HStack,
  Heading,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { CustomChakraNextLink, CustomIconButton } from '..';
import { useCallback, useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { FaWhatsapp } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/router';

export const AlertMessages = ({}: IAlertMessages) => {
  const router = useRouter();
  const { isSocio } = useContext(AuthContext);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const iconSize = useBreakpointValue(['15px', '20px']);
  const whatsappLinkGroup = 'https://chat.whatsapp.com/DPCBq2q3ZjQEt2wFUHDJeP';

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isSocio === true) {
      if (localStorage.getItem('socioWhatsappAlert') !== 'true') {
        setTimeout(() => {
          onOpen();
        }, 2000);
      }
    }
  }, [isSocio, onClose, onOpen]);
  return (
    <Collapse in={isOpen}>
      <Alert status="success" variant="top-accent">
        <AlertIcon />
        <Heading as="h2" fontSize={['md', 'xl']}>
          SÓCIO FÚRIA
        </Heading>
        <Text w="full" fontSize={['xs', 'md']} textAlign="center">
          Clique{' '}
          <CustomChakraNextLink
            href={whatsappLinkGroup}
            chakraLinkProps={{
              color: 'green.500',
              onClick: handleOnClose,
              _hover: {
                fontWeight: 'bold',
                textDecor: 'underline',
              },
            }}
          >
            aqui
          </CustomChakraNextLink>{' '}
          para entrar no grupo exclusivo para Associados!
        </Text>
        <HStack justify={'flex-end'}>
          <CustomIconButton
            aria-label="Entrar no grupo"
            onClick={() => router.push(whatsappLinkGroup)}
            icon={<FaWhatsapp size={iconSize} />}
          />
          <CustomIconButton
            aria-label="Fechar"
            colorScheme={'gray'}
            icon={<MdClose size={iconSize} />}
            onClick={handleOnClose}
          />
        </HStack>
      </Alert>
    </Collapse>
  );
};
