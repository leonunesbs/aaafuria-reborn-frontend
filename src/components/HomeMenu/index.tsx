import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import React from 'react';
import { MdStore } from 'react-icons/md';

interface HomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function HomeMenu({ setLoading }: HomeMenuProps) {
  const router = useRouter();
  return (
    <>
      <Button
        as="h2"
        leftIcon={<MdStore size="20px" />}
        colorScheme="green"
        onClick={() => {
          setLoading(true);
          router.push('/loja');
        }}
      >
        Loja
      </Button>
    </>
  );
}

export default HomeMenu;
