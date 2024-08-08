import { cookies } from "next/headers";
import CryptoJS from "crypto-js";



export default function createOAuthCookie(requestBody: any){ // 암호화 쿠키 생성
    const requestBodyString = JSON.stringify(requestBody);
    const encryptCookie = CryptoJS.AES.encrypt(requestBodyString, process.env.OAUTH_SECRET as string).toString();

    cookies().set('oauth', encryptCookie, {
        httpOnly: true,
        maxAge :  60 * 60,
      });
}