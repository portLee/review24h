import NextAuth from "next-auth";

// next-auth Session config
// user 객체에 id와 acceessToken 프로퍼티 타입을 추가함
declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
    };
  }
}
