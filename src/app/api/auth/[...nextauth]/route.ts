import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import {  Account, NextAuthOptions, Profile, User } from "next-auth";
import { cookies } from "next/headers";
import { createRefreshToken, signJwtAccessToken, verifyJwt } from "@/utils/auth/jwt";
import { jwtDecode } from 'jwt-decode';
import  createOAuthCookie  from "@/utils/auth/oAuthCookie";

// NextAuth 설정
export const  authOption:NextAuthOptions = NextAuth({

    // 세션 설정
    session: {
      strategy: "jwt", // 세션 전략으로 JWT 사용
    },

    // 페이지 설정
    pages: {
      signIn: "/authentication/login", // 로그인 페이지 경로
      signOut: "/", // 로그아웃 후 리다이렉트 경로
    },

    // 인증 프로바이더 설정
    providers: [

        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!
        }),

        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!
        }),

        CredentialsProvider({

            name: 'Reivew24', // 프로바이더 이름
            
            credentials: {
                email: {}, // 사용자 아이디 필드
                password: {}, // 비밀번호 필드
            },
            async authorize(credentials) {
                // 클라이언트에서 API로 로그인 요청
                const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                  method: 'POST',
                  headers: {
                    'Content-Type' : 'application/json',
                  },
                  body: JSON.stringify({
                    email: credentials?.email,
                    password: credentials?.password,
                  }),
                })
                
                // 로그인 실패 시 null 반환 // 401에러
                if(!response.ok){
                  return null;
                }
                // 로그인 성공 시 API 응답에서 데이터 추출
                const user = await response.json();
                
                console.log("nextAuth data ", user)
                

                // 유저 정보가 있는 경우 사용자 반환
                if(user !== null){
                  
                  const accessToken = signJwtAccessToken({mno : user.result.mno});
                  const refreshToken = createRefreshToken({mno : user.result.mno});
                  const rt_ex = jwtDecode(refreshToken).exp;
                  const exp = new Date(rt_ex * 1000);

                  const newCookie = cookies();
                  newCookie.set('refreshToken', refreshToken,{
                      // 쿠키 옵션 
                      expires: exp, // 쿠키 만료시간(refreshToken 만료시간과 동일)
                      httpOnly: true,
                      // secure: true,
                  })

                  const LoginUser = {
                    user: user.result,
                    accessToken,
                    refreshToken,
                  }

                  return LoginUser; 
                }else{
                  return false; // 유저 정보가 없는 경우 false 반환
                }

              },
        })
    ],
    // 콜백 함수 설정
    callbacks: {
      async signIn({ user, account, profile}) {

        // 커스텀 로그인
        if(account?.provider === 'credentials'){
          console.log("Credentials로 로그인");
          return true;
        }

        // 카카오 로그인
        if(account?.provider === 'kakao'){
          console.log("kakao로 로그인");
          // 회원확인
          const userResult = await pool.query('select * from user where memberId = ?', [profile.kakao_account.email]);
          const row = userResult[0];
          console.log("row ? ",row);
          // 회원가입 실행
          if(Array.isArray(row) && row.length === 0){ 
            console.log("회원가입 필요");
            const phone_number = formatPhoneNumber(profile.kakao_account.phone_number);
            const requestBody = {
              userId: profile.kakao_account.email,
              phone: phone_number,
              name: profile.kakao_account.name,
              social: 'kakao',
            }
            try{
              // 쿠키생성
              createOAuthCookie(requestBody);

              return '/signUp'; // 회원가입 페이지로 Redirect

            }catch (error){
              console.log(error);
            }
          }else{
            // 자체 JWT 발행
            const [userResult] = await pool.query('select mno from user where memberId = ? ', [profile.kakao_account.email]);
            const mno = userResult[0].mno;
            console.log("카카오 mno / ", mno);
            const accessToken = signJwtAccessToken({mno});
            const refreshToken = createRefreshToken({mno});
            const rt_ex = jwtDecode(refreshToken).exp;
            const exp = new Date(rt_ex * 1000);
            
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            const newCookie = cookies();
            newCookie.set('refreshToken', refreshToken,{
                // 쿠키 옵션 
                expires: exp, // 쿠키 만료시간(refreshToken 만료시간과 동일)
                httpOnly: true,
                // secure: true,
            });
      
            return true;
          }
        }

        // 네이버 로그인
        else if(account?.provider === 'naver'){
          console.log("naver로 로그인");
          console.log("$$$ profile ? ", profile);
          // 회원확인
          const userResult = await pool.query('select * from user where memberId = ?', [profile.response.email]);
          const row = userResult[0];
          // 회원가입 실행
          if(Array.isArray(row) && row.length === 0){
            const requestBody = {
              userId: profile.response.email,
              phone: profile.response.mobile,
              name: profile.response.name,
              social: 'naver',
            }
            try{
              createOAuthCookie(requestBody);

              return '/signUp';
            }catch(error){
              console.log(error);
            }
          }else{
            // 자체 JWT 발행
            const [userResult] = await pool.query('select mno from user where memberId = ? ', [profile.response.email]);
            const mno = userResult[0].mno;
            console.log("카카오 mno / ", mno);
            const accessToken = signJwtAccessToken({mno});
            const refreshToken = createRefreshToken({mno});
            const rt_ex = jwtDecode(refreshToken).exp;
            const exp = new Date(rt_ex * 1000);
            
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            const newCookie = cookies();
            newCookie.set('refreshToken', refreshToken,{
                // 쿠키 옵션 
                expires: exp, // 쿠키 만료시간(refreshToken 만료시간과 동일)
                httpOnly: true,
                // secure: true,
            });
            return true;
          }
        }

        return true;
      },
      // JWT 업데이트 콜백
      async jwt({token, user, account, profile, trigger, session}){
          // 사용자 정보가 있는 경우 토큰에 추가
          console.log(" $$$ Token ",token);
         

          // 새로 발급 받은 액세스토큰 세션 업데이트
          if(trigger === 'update' && session.accessToken){
              token.accessToken = session.accessToken
          }

        return {...token, ...user};
      },

      async session({session, token}){

        session.user = token as any;
        console.log("$$$ Session : ", session);
        return session;
      },
      
      // 리다이렉트 콜백
      async redirect({url, baseUrl}){
        if(url.startsWith('/signUp')){
          console.log("회원가입 페이지로 이동 ");
          return '/signUp';
        }
        return baseUrl;
      }
    }
})


function formatPhoneNumber(phoneNumber: string) {
    
    // 전화번호에서 +82를 제거하고 010을 앞에 추가
    const cleanedNumber = phoneNumber.replace(/\+82\s*/, '');
    const formattedNumber = `0${cleanedNumber}`;
    
    return formattedNumber;
  }

// signIn을 POST 및 GET 메서드로 익스포트
export {authOption as POST, authOption as GET}