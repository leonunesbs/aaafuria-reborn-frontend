import client from '@/services/apollo-client';
import { createContext, useState } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
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
      nome
      email
      isSocio
      user {
        isStaff
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
  matricula: string;
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [isSocio, setIsSocio] = useState<boolean | null>(null);

  const router = useRouter();

  const { ['aaafuriaToken']: token } = parseCookies();
  const matricula = parseCookies()['aaafuriaMatricula'];

  const isAuthenticated = !!token;

  const checkCredentials = async () => {
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
      return response.data.socioByMatricula?.isSocio;
    }
  };

  const signIn = async ({ matricula, pin, redirectUrl }: SignInData) => {
    return await client
      .mutate({
        mutation: SIGN_IN,
        variables: {
          matricula: matricula,
          pin: pin,
        },
      })
      .then(({ data }) => {
        setCookie(null, 'aaafuriaToken', data.tokenAuth.token, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        setCookie(null, 'aaafuriaMatricula', matricula, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        setUser({ matricula: data.tokenAuth.payload.username });

        checkCredentials();

        router.push(redirectUrl || '/');
        return data;
      })
      .catch((err) => {
        console.log(err);
        router.reload();
      });
  };

  const signOut = () => {
    setUser(null);
    destroyCookie(null, 'aaafuriaToken');
    destroyCookie(null, 'aaafuriaMatricula');
    destroyCookie(null, 'aaafuriaIsSocio');
    destroyCookie(null, 'aaafuriaIsStaff');
    try {
      localStorage.removeItem('aaafuria@signUpMatricula');
    } catch (err) {
      console.log(err);
    }
    router.push('/entrar');
  };

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
