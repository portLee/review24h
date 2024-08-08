import fetch, { Headers } from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import makeFetchCookie from 'fetch-cookie';

interface PublicKeyResponse {
    tag: string;
    value: string;
}

const BASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Referer': 'https://biz-member.baemin.com/login?returnUrl=https%3A%2F%2Fself.baemin.com%2Fshops%2Freviews'
};

const cookieJar = new CookieJar();
const fetchWithCookies = makeFetchCookie(fetch, cookieJar);

export default class BaeminApiService {
    private static instance: BaeminApiService;

    // 싱글톤 패턴 구현
    public static getInstance(): BaeminApiService {
        if (!BaeminApiService.instance) {
            BaeminApiService.instance = new BaeminApiService();
        }
        return BaeminApiService.instance;
    }

    // 공개키 조회
    async getPublic(url: string): Promise<PublicKeyResponse> {
        const options = {
            headers: BASE_HEADERS,
            cache: 'no-cache' as RequestCache
        };

        const response = await fetchWithCookies(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch public key: ${response.statusText}`);
        }

        const responseData = await response.json() as { data: PublicKeyResponse };
        const { tag, value } = responseData.data;

        console.log('Public Key:', { tag, value });

        return { tag, value };
    }

    // 로그인
    async login(url: string, credentials: any) {
        const headers = new Headers({
            ...BASE_HEADERS,
            "Content-Type": "application/json"
        });

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(credentials)
        };

        const response = await fetchWithCookies(url, options);

        if (!response.ok) {
            throw new Error(`Beamin Login failed: ${response.statusText}`);
        }

        const responseBody = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseBody);
    }

    // 프로필 조회
    async getProfile(url: string): Promise<string>{
        const headers = new Headers({
            ...BASE_HEADERS,
            "Service-Channel": "SELF_SERVICE_PC"
        });

        const options = {
            headers: headers
        };

        const response = await fetchWithCookies(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const responseData: any = await response.json();
        console.log('Profile data:', responseData);

        // shopOwnerNumber만 추출하여 반환
        return responseData.shopOwnerNumber;
    }

    // 가게 정보 조회
    async getShopInfo(url: string): Promise<any>{
        const headers = new Headers({
            ...BASE_HEADERS,
            "Service-Channel": "SELF_SERVICE_PC"
        });

        const options = {
            headers: headers
        };

        const response = await fetchWithCookies(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch shop info: ${response.statusText}`);
        }

        const responseData: any = await response.json();
        console.log('Shop data:', responseData);

        return responseData;
    }

    // 리뷰 목록 조회
    async getReviews(url: string): Promise<any>{
        const headers = new Headers({
            ...BASE_HEADERS,
            "Service-Channel": "SELF_SERVICE_PC"
        });

        const options = {
            headers: headers
        };

        const response = await fetchWithCookies(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const responseData: any = await response.json();
        console.log('Reviews data:', responseData);

        return responseData;
    }

    // 답글 등록 
}