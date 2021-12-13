import CustomButtom from '../CustomButtom';
import CustomChakraNextLink from '../CustomChakraNextLink';
import React from 'react';
import { MdStore } from 'react-icons/md';

interface HomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function HomeMenu({ setLoading }: HomeMenuProps) {
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
}

export default HomeMenu;
