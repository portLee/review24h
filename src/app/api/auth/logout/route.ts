import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    const cookie = cookies();
    
    cookie.delete('refreshToken');
    return new NextResponse(JSON.stringify({message: "로그아웃"}))
}