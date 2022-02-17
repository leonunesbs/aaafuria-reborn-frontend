import { CustomIconButton } from '@/components/atoms';
import { MdShoppingCart } from 'react-icons/md';
import { CustomButtomProps } from '../CustomButton';

export type FloatingCarrinhoPlantaoButtonProps = CustomButtomProps;

export const FloatingCarrinhoPlantaoButton = ({
  ...rest
}: FloatingCarrinhoPlantaoButtonProps) => {
  return (
    <CustomIconButton
      aria-label="add_to_cart"
      variant={'solid'}
      icon={<MdShoppingCart size="25px" />}
      position="fixed"
      right={10}
      bottom={10}
      zIndex={10}
      shadow="base"
      {...rest}
    />
  );
};
