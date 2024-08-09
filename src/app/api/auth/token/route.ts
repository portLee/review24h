import { NextRequest, NextResponse } from "next/server";
import { signJwtAccessToken, verifyJwt } from "@/utils/auth/jwt";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { getUser } from "@/services/AuthService";


export async function POST(req:NextRequest) {
    const {accessToken} = await req.json();
    
    if(!accessToken){
        // 엑세스토큰이 제공되지 않은 경우
        return new NextResponse(JSON.stringify({message: "엑세스토큰이 제공되지 않았습니다."}),{status : 400})
    }

    const verifyAT = verifyJwt(accessToken);

    if(!verifyAT){
        // 엑세스토큰이 유효하지 않은 경우
        return new NextResponse(JSON.stringify({message: "엑세스토큰이 유효하지 않습니다."}), {status: 401})
    }

    const cookie = cookies();
    const refreshToken = cookie.get('refreshToken');
    const refreshTokenString = (refreshToken as { value: string })?.value || '';

    console.log(refreshToken?.value);

    const verifyRT = verifyJwt(refreshTokenString);
   
    if(!verifyRT){
        // 리프레시토큰이 유효하지 않은 경우
        return new NextResponse(JSON.stringify({message: "리프레시토큰이 유효하지 않습니다."}),{status: 401});
    }
    
    const rt_ex = jwtDecode(refreshTokenString).exp;
    const currentTime = Math.floor(Date.now() / 1000 ); 

    if((rt_ex-currentTime) <= 0){
        // 리프레시토큰이 만료된 경우
        return new NextResponse(JSON.stringify({message: "리프레시토큰 만료되었습니다."}), {status : 403})
    }
        
    const at_mno = jwtDecode(accessToken).mno;
    const rt_mno = jwtDecode(refreshTokenString).mno;

    if(at_mno !== rt_mno){
        // 액세스토큰의 mno와 리프레시토큰의 mno가 동일하지 않은 경우
        return new NextResponse(JSON.stringify({message: "사용자가 일치하지 않습니다."}), {status: 403})
    }
        
    const user = await getUser(rt_mno);
    const newAccessToken = signJwtAccessToken({mno: user.mno});

    return NextResponse.json({accessToken: newAccessToken})
}



