import React from 'react';
import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';
import { GiPartyPopper } from 'react-icons/gi';
import { MdStore } from 'react-icons/md';
import { Stack } from '@chakra-ui/react';
interface HomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HomeMenu = ({ setLoading }: HomeMenuProps) => {
  return (
    <Stack>
      <CustomChakraNextLink href="/loja">
        <CustomButtom
          leftIcon={<MdStore size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
        >
          Loja
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/eventos">
        <CustomButtom
          leftIcon={<GiPartyPopper size="20px" />}
          onClick={() => {
            setLoading(true);
          }}
          isDisabled
        >
          Eventos
        </CustomButtom>
      </CustomChakraNextLink>
    </Stack>
  );
};
