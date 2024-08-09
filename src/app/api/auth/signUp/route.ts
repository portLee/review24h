import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/services/AuthService";
import { cookies } from "next/headers";
import CryptoJS from "crypto-js";
import { error } from "console";

export async function POST(req: NextRequest){
    const body = await req.json();
    

    // 검증하는 메소드 

    const cookie = cookies().get('oauth');
    const decryptCookie = CryptoJS.AES.decrypt(cookie?.value, process.env.OAUTH_SECRET).toString(CryptoJS.enc.Utf8)
    const oauth = JSON.parse(decryptCookie);

    if(oauth){ // 소셜이면 비밀번호 재설정
        body.email = oauth.email;
        body.password = '1111';
        body.name = oauth.name;
        body.phone = oauth.phone;
        body.social = oauth.social;
    }
    console.log("body ? ? ",body);
    try{
        const result = await signUp(body);
        cookies().delete('oauth');
        if(result === true){
            return NextResponse.json({message: "회원가입 성공"}, {status: 200});
        }else{
            
            return NextResponse.json({message: "중복오류가 발생했습니다. 다시 시도해주세요"}, {status: 400});
        }
        
    }catch(error){
        return NextResponse.json({error: error.message}, {status:400});
    }
    
}