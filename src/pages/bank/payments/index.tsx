import { ReactNode } from 'react';

interface PaymentsProps {
  children: ReactNode;
}

function Payments({ children }: PaymentsProps) {
  return (
    <>
      <h1>Payments</h1>
      {children}
    </>
  );
}

export default Payments;
