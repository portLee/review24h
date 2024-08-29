import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/utils/session";
import { SessionData } from "@/utils/session";
import RSAEncryptionService from '@/services/RSAEncryptionService';
import BaeminApiService from '@/services/BaeminApiService';

const USER_ID = process.env.USER_ID;
const PASSWORD = process.env.PASSWORD;
const HARDCODED_PW = 'shd29pv5qp59shpjw4q2uoz7lb0l8xnrrjn2eikx7rsawq5wdmuv3im703yl';

const getFormattedDate = (today: Date) => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// 배민 review 조회
export async function GET(req: NextRequest) {
    const rsaEncryptionService = RSAEncryptionService.getInstance();
    const baeminApiService = BaeminApiService.getInstance();

    try {
        // // 공개키 조회
        // const { tag, value } = await baeminApiService.getPublic();
        // console.log('Public Key (n):', tag);
        // console.log('Public Exponent (e):', value);

        // // 아이디 비밀번호 암호화
        // rsaEncryptionService.setPublic(tag, value);
        // const value1 = rsaEncryptionService.encrypt(USER_ID);
        // const value2 = rsaEncryptionService.encrypt(PASSWORD);

        // console.log('Encrypted value1:', value1);
        // console.log('Encrypted value2:', value2);

        // const payload = {
        //     id: USER_ID,
        //     pw: HARDCODED_PW,
        //     token: "",
        //     value1: value1,
        //     value2: value2
        // }

        // console.log('Request payload:', payload);

        // // 배민 로그인
        // await baeminApiService.login(payload);

        // // 사장님 고유 번호 조회
        // const shopOwnerNumber = await baeminApiService.getProfile();
        // console.log(`shopOwnerNumber: ${shopOwnerNumber}`);

        // const data = await baeminApiService.getShopInfo();
        
        // // 필요한 정보만 추출
        // const shops = data.content.map(({ shopNo, name, serviceType }) => ({
        //     shopNo,
        //     name,
        //     serviceType
        // }));
        // console.log(shops);

        const session = await getIronSession<SessionData>(cookies(), sessionOptions);

        console.log("session: " + JSON.stringify(session));
        console.log("cookie: " + session.cookie);

        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 26);
        monthAgo.setMonth(today.getMonth() - 5);
        const to = getFormattedDate(today);
        const from = getFormattedDate(monthAgo);

        console.log('from:', from);
        console.log('to:', to);

        const params = {
            from: from,
            to: to,
            offset: 0,
            limit: 10
        }

        const reviewData = await baeminApiService.getReviews(params, session.cookie);

        return NextResponse.json(reviewData.reviews);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}