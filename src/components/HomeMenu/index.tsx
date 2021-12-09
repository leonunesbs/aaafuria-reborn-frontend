import { Button } from '@chakra-ui/button';
import { chakra, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { MdStore } from 'react-icons/md';

interface HomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function HomeMenu({ setLoading }: HomeMenuProps) {
  const router = useRouter();
  const ChakraNextLink = chakra(NextLink);
  return (
    <ChakraNextLink href="/loja" passHref>
      <Link _hover={{ textDecoration: 'none' }}>
        <Button
          as="h2"
          leftIcon={<MdStore size="20px" />}
          colorScheme="green"
          variant="ghost"
          onClick={() => {
            setLoading(true);
            router.push('/loja');
          }}
          w="full"
        >
          Loja
        </Button>
      </Link>
    </ChakraNextLink>
  );
}

export default HomeMenu;
