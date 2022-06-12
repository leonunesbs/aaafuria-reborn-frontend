import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaymentMethodsProps {}

const PaymentMethods = ({ ...rest }: PaymentMethodsProps) => {
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
          {data?.allPaymentMethods?.map(({ id, name }) => (
            <Radio key={id} value={id} colorScheme={'green'}>
              {name}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
    </FormControl>
  );
};

export default PaymentMethods;
