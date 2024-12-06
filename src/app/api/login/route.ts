import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, defaultSession } from "@/utils/session";
import { redirect } from "next/navigation";
import { SessionData, sleep } from "@/utils/session";
import BaeminApiService from "@/services/BaeminApiService";
import RSAEncryptionService from "@/services/RSAEncryptionService";

const HARDCODED_PW = 'shd29pv5qp59shpjw4q2uoz7lb0l8xnrrjn2eikx7rsawq5wdmuv3im703yl';

// 로그인 처리
export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    // 아이디, 비밀번호
    const { id, password } = await request.json();

    // 로그인 로직

    // 공개키 조회
    const baeminApiService = BaeminApiService.getInstance();
    const { tag, value } = await baeminApiService.getPublic();
    console.log('Public Key (n):', tag);
    console.log('Public Exponent (e):', value);
    
    // DB에서 배민 아이디, 비밀번호 조회

    // 아이디 비밀번호 암호화
    const rsaEncryptionService = RSAEncryptionService.getInstance();
    rsaEncryptionService.setPublic(tag, value);
    const value1 = rsaEncryptionService.encrypt(id);
    const value2 = rsaEncryptionService.encrypt(password);

    console.log('Encrypted value1:', value1);
    console.log('Encrypted value2:', value2);

    const payload = {
        id: id,
        pw: HARDCODED_PW,
        token: "",
        value1: value1,
        value2: value2
    }

    console.log('Request payload:', payload);

    // 배민 로그인 후 쿠키 값 리턴
    const bmCookies = await baeminApiService.login(payload);

    session.id = 1;
    session.username = id; 
    session.isLoggedIn = true;
    session.cookie = bmCookies;
    await session.save();

    // simulate looking up the user in db
    // await sleep(250);

    return NextResponse.redirect(
        `${request.nextUrl.origin}/`,
        303,
    );
}

// /app-router-client-component-redirect-route-handler-fetch/session
// /app-router-client-component-redirect-route-handler-fetch/session?action=logout
export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const action = new URL(request.url).searchParams.get("action");
  // /app-router-client-component-redirect-route-handler-fetch/session?action=logout
  if (action === "logout") {
    session.destroy();
    return redirect(
      "/login",
    );
  }

  // simulate looking up the user in db
  await sleep(250);

  if (session.isLoggedIn !== true) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}