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
      user {
        isStaff
        member {
          id
          registration
          name
          nickname
          group
          email
          avatar
          birthDate
          rg
          cpf
          hasActiveMembership
          firstTeamer
          activeMembership {
            startDate
            currentEndDate
          }
        }
      }
    }
  }
`;

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string;
  signIn: (data: SignInData) => Promise<{
    tokenAuth: {
      token: string;
      payload: string;
      user: UserData;
    };
  }>;
  signOut: () => void;
  checkAuth: () => Promise<void>;
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
  isStaff: boolean;
  member: {
    id: string;
    registration: string;
    name: string;
    nickname: string;
    group: string;
    email: string;
    avatar: string;
    birthDate: string;
    rg: string;
    cpf: string;
    hasActiveMembership: boolean;
    firstTeamer: boolean;
    activeMembership: {
      startDate: string;
      currentEndDate: string;
    } | null;
  };
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);

  const router = useRouter();

  const { ['aaafuriaToken']: token } = parseCookies();

  const isAuthenticated = useMemo(() => !!token, [token]);

  const signOut = useCallback(() => {
    destroyCookie(null, 'aaafuriaToken');
    setUser(null);

    router.reload();
  }, [router]);

  const checkAuth = useCallback(async () => {
    if (isAuthenticated) {
      const { data, errors } = await client.query({
        query: gql`
          query getUser {
            user {
              isStaff
              member {
                id
                registration
                name
                nickname
                group
                email
                avatar
                birthDate
                rg
                cpf
                hasActiveMembership
                firstTeamer
                activeMembership {
                  startDate
                  currentEndDate
                }
              }
            }
          }
        `,
        context: {
          headers: {
            Authorization: `JWT ${token}`,
          },
        },
      });

      if (errors) {
        signOut();
        throw errors;
      }

      setUser(data.user);
    }
  }, [isAuthenticated, signOut, token]);

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

          setUser(data.tokenAuth.user);

          router.push(redirectUrl || '/');

          if (errors) {
            throw errors;
          }

          return data;
        });

      return response;
    },
    [router],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        signIn,
        signOut,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
