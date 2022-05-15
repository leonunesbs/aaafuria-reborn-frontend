import { createContext, useCallback, useMemo, useState } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';

const SIGN_IN = gql`
  mutation getToken($matricula: String!, $pin: String!) {
    tokenAuth(username: $matricula, password: $pin) {
      token
      payload
    }
  }
`;

const QUERY_SOCIO = gql`
  query socioByMatricula($matricula: String!) {
    socioByMatricula(matricula: $matricula) {
      id
      apelido
      nome
      avatar
      email
      isSocio
      matricula
      user {
        isStaff
      }
      conta {
        calangos
      }
    }
  }
`;

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string;
  matricula: string;
  signIn: (data: SignInData) => Promise<void>;
  checkCredentials: () => Promise<boolean>;
  isStaff: boolean | null;
  isSocio: boolean | null;
  signOut: () => void;
  user: UserData | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

type SignInData = {
  matricula: string;
  pin: string;
  redirectUrl?: string;
};

type UserData = {
  id: string;
  apelido: string;
  nome: string;
  email: string;
  user: {
    isStaff: string;
  };
  avatar: string;
  isSocio: string;
  matricula: string;
  conta: {
    calangos: string;
  };
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [isSocio, setIsSocio] = useState<boolean | null>(null);

  const router = useRouter();

  const { ['aaafuriaToken']: token } = parseCookies();
  const matricula = parseCookies()['aaafuriaMatricula'];

  const isAuthenticated = useMemo(() => !!token, [token]);

  const signOut = useCallback(() => {
    destroyCookie(null, 'aaafuriaToken');
    destroyCookie(null, 'aaafuriaMatricula');
    destroyCookie(null, 'aaafuriaIsSocio');
    destroyCookie(null, 'aaafuriaIsStaff');

    setUser(null);
    setIsStaff(null);
    setIsSocio(null);
  }, []);

  const checkCredentials = useCallback(async () => {
    if (isAuthenticated) {
      if (!matricula) {
        return false;
      }
      const response = await client.query({
        query: QUERY_SOCIO,
        variables: {
          matricula: matricula,
        },
      });

      setUser(response.data.socioByMatricula);

      if (response.data.socioByMatricula === null) {
        return signOut();
      }
      setCookie(
        null,
        'aaafuriaIsSocio',
        response.data.socioByMatricula?.isSocio,
        {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        },
      );

      if (response.data.socioByMatricula?.user.isStaff) {
        setCookie(
          null,
          'aaafuriaIsStaff',
          response.data.socioByMatricula?.user.isStaff,
          {
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          },
        );
      }

      const { ['aaafuriaIsSocio']: aaafuriaIsSocio } = parseCookies();
      const { ['aaafuriaIsStaff']: aaafuriaIsStaff } = parseCookies();

      setIsSocio(aaafuriaIsSocio === 'true');
      setIsStaff(aaafuriaIsStaff === 'true');

      return response?.data.socioByMatricula?.isSocio;
    }
  }, [isAuthenticated, matricula, signOut]);

  const signIn = useCallback(
    async ({ matricula, pin, redirectUrl }: SignInData) => {
      const response = await client
        .mutate({
          mutation: SIGN_IN,
          variables: {
            matricula: matricula,
            pin: pin,
          },
        })
        .then(async ({ data, errors }) => {
          setCookie(null, 'aaafuriaToken', data.tokenAuth.token, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          });
          setCookie(null, 'aaafuriaMatricula', matricula, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          });

          await checkCredentials();

          router.push(redirectUrl || '/');

          if (errors) {
            throw errors;
          }

          return data;
        });

      return response;
    },
    [checkCredentials, router],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        matricula,
        isAuthenticated,
        signIn,
        signOut,
        checkCredentials,
        isSocio,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
