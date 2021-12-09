import CustomButtom from '../CustomButtom';
import NextLink from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import router from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { ButtonProps } from '@chakra-ui/button';
import { chakra, Link } from '@chakra-ui/react';
import { MdGroups } from 'react-icons/md';
import { parseCookies } from 'nookies';

interface SejaSocioButtonProps extends ButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function SejaSocioButton({ setLoading, ...rest }: SejaSocioButtonProps) {
  const ChakraNextLink = chakra(NextLink);
  const { checkSocio } = useContext(AuthContext);

  const [isSocio, setIsSocio] = useState(false);
  useEffect(() => {
    checkSocio();
    setIsSocio(parseCookies()['aaafuriaIsSocio'] === 'true');
  }, [checkSocio]);

  if (isSocio) {
    return <></>;
  }

  return (
    <ChakraNextLink passHref href="/sejasocio">
      <Link _hover={{ textDecoration: 'none' }}>
        <CustomButtom
          leftIcon={<MdGroups size="20px" />}
          variant="outline"
          onClick={() => {
            setLoading(true);
            router.push('/sejasocio');
          }}
          {...rest}
        >
          Clique aqui e Seja Sócio!
        </CustomButtom>
      </Link>
    </ChakraNextLink>
  );
}

export default SejaSocioButton;
