import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/button';
import router from 'next/router';
import { MdGroups } from 'react-icons/md';
import NextLink from 'next/link';
import { chakra, Link } from '@chakra-ui/react';

interface SejaSocioButtonProps extends ButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function SejaSocioButton({ setLoading, ...rest }: SejaSocioButtonProps) {
  const ChakraNextLink = chakra(NextLink);

  return (
    <ChakraNextLink passHref href="/sejasocio">
      <Link _hover={{ textDecoration: 'none' }}>
        <Button
          as="h2"
          leftIcon={<MdGroups size="20px" />}
          colorScheme="green"
          variant="outline"
          onClick={() => {
            setLoading(true);
            router.push('/sejasocio');
          }}
          w="full"
          {...rest}
        >
          Clique aqui e Seja Sócio!
        </Button>
      </Link>
    </ChakraNextLink>
  );
}

export default SejaSocioButton;
