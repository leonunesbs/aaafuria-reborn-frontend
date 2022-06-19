import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { ControllerRenderProps } from 'react-hook-form';
import { useContext } from 'react';

const PAYMENT_METHODS = gql`
  {
    allPaymentMethods {
      id
      title
      name
    }
  }
`;

type PaymentMethods = {
  allPaymentMethods: {
    id: string;
    title: string;
    name: string;
  }[];
};

export interface PaymentMethodsProps extends ControllerRenderProps {
  disabledMethods?: string[];
}

const PaymentMethods = ({ disabledMethods, ...rest }: PaymentMethodsProps) => {
  const { token } = useContext(AuthContext);
  const { data } = useQuery<PaymentMethods>(PAYMENT_METHODS, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <FormControl isRequired>
      <FormLabel>Forma de pagamento: </FormLabel>
      <RadioGroup colorScheme={'green'} {...rest}>
        <HStack>
          {data?.allPaymentMethods?.map(({ id, title, name }) => {
            return (
              <Radio
                key={id}
                value={id}
                colorScheme={'green'}
                isDisabled={disabledMethods?.includes(title)}
              >
                {name}
              </Radio>
            );
          })}
        </HStack>
      </RadioGroup>
    </FormControl>
  );
};

export default PaymentMethods;
