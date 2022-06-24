import { Input, InputProps } from '@chakra-ui/react';
import { forwardRef, useContext } from 'react';

import { ColorContext } from '@/contexts/ColorContext';

export type CustomInputProps = InputProps;

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ ...rest }, ref) => {
    const { green } = useContext(ColorContext);
    return <Input ref={ref} rounded="3xl" focusBorderColor={green} {...rest} />;
  },
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
