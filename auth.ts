import NextAuth , { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import type {
  User,
  UserObject,
  AuthValidity,
  BackendAccessJWT,
  BackendJWT,
  DecodedJWT
} from "next-auth";


class customError extends AuthError {
  constructor(message: string) {
      super()
      this.message = message
  }
}

async function refreshAccessToken(nextAuthJWTCookie: JWT): Promise<JWT> {
  try {

    const response = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/admin/refresh`,
      {    method: "POST",
        headers: {
          Authorization: `Bearer ${nextAuthJWTCookie.data.tokens.refresh_token}`,
        },
      }
    );
    const accessToken: BackendAccessJWT = await response.json();
    if (!response.ok) throw accessToken;

    const { exp }: DecodedJWT = jwtDecode(accessToken.access_token);
// Update the token and validity in the next-auth cookie
nextAuthJWTCookie.data.validity.valid_until = exp;
nextAuthJWTCookie.data.tokens.access_token = accessToken.access_token;

// Clone the object to ensure it has a new ref id
return { ...nextAuthJWTCookie };

   
  } catch (error) {
    console.debug(error);
    return {
      ...nextAuthJWTCookie,
      error: "RefreshAccessTokenError"
    };
  }
}

export const {auth,
  handlers,
  signIn,
  signOut,
} = NextAuth({ secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Day
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.API_SERVER_BASE_URL}/api/admin/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          
          if (!res.ok){
            const data = await res.json();
            
            const errorMessage = data.error || data.details || "Login failed.";
            throw new Error(errorMessage);// Throw error with the extracted message
            
            }
          const tokens: BackendJWT = await res.json();
          
          const access: DecodedJWT = jwtDecode(tokens.access_token);
          const refresh: DecodedJWT = jwtDecode(tokens.refresh_token);
          const user: UserObject = {
            name: access.name,
            email: access.email,
            avatar : access.avatar ,
            is_staff : access.is_staff ,
            id: access.id
          };

// Extract the auth validity from the tokens
const validity: AuthValidity = {
  valid_until: access.exp,
  refresh_until: refresh.exp
};

return {
  // User object needs to have a string id so use refresh token id
  id: refresh.jti,
  tokens: tokens,
  user: user,
  validity: validity
} as User;
        } catch (e: any) {
          console.log(e);
          
          throw new customError(e.message || "An unexpected error occurred.");
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
    jwt: async ({ token, user, account }) => {
     

      if (user && account) {
        return { ...token, data: user };
      }


         // The current access token is still valid
      if (Date.now() < token.data.validity.valid_until * 1000) {
        return token;
      }

      // The refresh token is still valid
      if (Date.now() < token.data.validity.refresh_until * 1000) {
        return await refreshAccessToken(token);
      }

      // The current access token and refresh token have both expired
      // This should not really happen unless you get really unlucky with
      // the timing of the token expiration because the middleware should
      // have caught this case before the callback is called
      return { ...token, error: "RefreshTokenExpired" } as JWT;

    },
    session: async ({ session, token, user  }) => {
      session.user.is_staff = token.data.user.is_staff;
      session.user.name = token.data.user.name;
      session.user.email = token.data.user.email;
      session.user.avatar = token.data.user.avatar
      session.validity = token.data.validity;
      session.error = token.error;
      session.sessionToken = token.data.tokens.access_token
      return session;
    },
  },
});
