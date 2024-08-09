import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import CryptoJS from "crypto-js";

export async function GET(req: NextRequest) { // 쿠키 복호화
  
  const oauthCookie = cookies().get('oauth');
  if(!oauthCookie){
    console.log("쿠키없음")
    return NextResponse.json(null);
  }
  const decryptCookie = CryptoJS.AES.decrypt(oauthCookie?.value, process.env.OAUTH_SECRET).toString(CryptoJS.enc.Utf8)
  console.log("쿠키이름 decryptCookie ? ", decryptCookie);
  return NextResponse.json({ oauthCookie: decryptCookie });
}
