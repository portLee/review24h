import { NextRequest, NextResponse } from 'next/server';
import RSAEncryptionService from '@/services/RSAEncryptionService';
import BaeminApiService from '@/services/BaeminApiService';

const LOGIN_INIT_URL = 'https://biz-member.baemin.com/v1/login/init';
const LOGIN_URL = 'https://biz-member.baemin.com/v1/login';
const PROFILE_URL = 'https://self-api.baemin.com/v1/session/profile';
const SHOP_URL = 'https://self-api.baemin.com/v4/store/shops/search';
const REVIEWS_URL = 'https://self-api.baemin.com/v1/review/shops';
const USER_ID = '아이디';
const PASSWORD = '비밀번호';
const HARDCODED_PW = 'shd29pv5qp59shpjw4q2uoz7lb0l8xnrrjn2eikx7rsawq5wdmuv3im703yl';

// 배민 review 조회
export async function GET(req: NextRequest) {
    const rsaEncryptionService = RSAEncryptionService.getInstance();
    const baeminApiService = BaeminApiService.getInstance();

    try {
        // 공개키 조회
        const { tag, value } = await baeminApiService.getPublic(LOGIN_INIT_URL);
        console.log('Public Key (n):', tag);
        console.log('Public Exponent (e):', value);

        // 아이디 비밀번호 암호화
        rsaEncryptionService.setPublic(tag, value);
        const value1 = rsaEncryptionService.encrypt(USER_ID);
        const value2 = rsaEncryptionService.encrypt(PASSWORD);

        console.log('Encrypted value1:', value1);
        console.log('Encrypted value2:', value2);

        const payload = {
            id: USER_ID,
            pw: HARDCODED_PW,
            token: "",
            value1: value1,
            value2: value2
        }

        console.log('Request payload:', payload);

        // 배민 로그인
        await baeminApiService.login(LOGIN_URL, payload);

        // 사장님 고유 번호 조회
        const shopOwnerNumber = await baeminApiService.getProfile(PROFILE_URL);
        console.log(`shopOwnerNumber: ${shopOwnerNumber}`);

        const data = await baeminApiService.getShopInfo(`${SHOP_URL}?shopOwnerNo=${shopOwnerNumber}`);
        
        // 필요한 정보만 추출
        const shops = data.content.map(({ shopNo, name, serviceType }) => ({
            shopNo,
            name,
            serviceType
        }));
        console.log(shops);

        const reviewData = await baeminApiService.getReviews(`${REVIEWS_URL}/${shops[0].shopNo}/reviews?from=2024-02-10&to=2024-08-07&offset=0&limit=10`);

        return NextResponse.json(reviewData.reviews);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}