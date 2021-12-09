import CustomButtom from '../CustomButtom';
import NextLink from 'next/link';
import React from 'react';
import { chakra, Link } from '@chakra-ui/react';
import { MdStore } from 'react-icons/md';
import { useRouter } from 'next/router';

interface HomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function HomeMenu({ setLoading }: HomeMenuProps) {
  const router = useRouter();
  const ChakraNextLink = chakra(NextLink);
  return (
    <ChakraNextLink href="/loja" passHref>
      <Link _hover={{ textDecoration: 'none' }}>
        <CustomButtom
          leftIcon={<MdStore size="20px" />}
          onClick={() => {
            setLoading(true);
            router.push('/loja');
          }}
        >
          Loja
        </CustomButtom>
      </Link>
    </ChakraNextLink>
  );
}

export default HomeMenu;
