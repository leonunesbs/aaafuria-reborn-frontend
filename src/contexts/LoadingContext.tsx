import { Dispatch, SetStateAction, createContext, useState } from 'react';

interface LoadingContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingContext = createContext({} as LoadingContextProps);

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}
