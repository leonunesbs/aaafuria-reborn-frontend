import React from 'react';
import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';
import { MdStore } from 'react-icons/md';

interface HomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HomeMenu = ({ setLoading }: HomeMenuProps) => {
  return (
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
  );
};
