import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/utils/session";
import { SessionData } from "@/utils/session";
import BaeminApiService from "@/services/BaeminApiService";

// 배민 review 답글 등록
export async function POST(req: NextRequest) {
    const baeminApiService = BaeminApiService.getInstance();

    try {
        const session = await getIronSession<SessionData>(cookies(), sessionOptions);

        // 세션 데이터 확인
        console.log("Session Data:", session.cookie);

        // 요청에서 JSON 데이터 파싱
        const { reviewId, contents } = await req.json();

        // 필요한 검증 로직 추가 (예: reviewId와 replyContent가 존재하는지 확인)
        if (!reviewId || !contents) {
            return NextResponse.json({ error: "Review ID and contents are required." }, { status: 400 });
        }

        const payload = {
            reviewId,
            contents,
            // createdAt: new Date().toISOString(),
        };

        // 리뷰 데이터베이스에 답글을 추가하는 로직
        // 예: 데이터베이스에 추가하거나 외부 API로 전송하는 코드
        await baeminApiService.addComment(payload, session.cookie);

        console.log('New comment added:', payload);

        // 성공 응답
        return NextResponse.json({ message: "Comment added successfully", reply: payload }, { status: 201 });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
