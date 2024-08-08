import { signIn } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const body = await req.json()
  
    const result = await signIn(body);

    if(result !== null){ // 로그인 성공
        return NextResponse.json({result});
    }else{ // 로그인 실패
        return NextResponse.json(null);
    }

  }
  