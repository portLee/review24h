import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/services/AuthService";

export async function POST(req: NextRequest){
    const body = await req.json();
    console.log("body ? ? ",body);

    // 검증하는 메소드 

    body.social = 'credentials';

    // 회원가입 메소드
    try{
        const result = await signUp(body);
        
        if(result === true){
            return NextResponse.json({message: "회원가입 성공"}, {status: 200});
        }else{
            return NextResponse.json({message: "중복오류가 발생했습니다. 다시 시도해주세요"}, {status: 400});
        }
        
    }catch(error){
        return NextResponse.json({error: error.message}, {status:400});
    }
    
}