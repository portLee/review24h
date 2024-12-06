import fetch, { Headers } from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import makeFetchCookie from 'fetch-cookie';

interface PublicKeyResponse {
    tag: string;
    value: string;
}

const BASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    "Origin": "https://self.baemin.com",
    'Referer': 'https://self.baemin.com/'
};

const LOGIN_URL = process.env.BIZ_API_BASE_URL + '/v1/login';
const LOGIN_INIT_URL = LOGIN_URL + '/init';
const PROFILE_URL = process.env.SELF_API_BASE_URL + '/v1/session/profile';
const SHOP_URL = process.env.SELF_API_BASE_URL + '/v4/store/shops/search';
const REVIEWS_BASE_URL = process.env.SELF_API_BASE_URL + '/v1/review/shops';

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
    public async getPublic(): Promise<PublicKeyResponse> {
        const options = {
            headers: BASE_HEADERS,
            cache: 'no-cache' as RequestCache
        };

        const response = await fetchWithCookies(LOGIN_INIT_URL, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch public key: ${response.statusText}`);
        }

        const responseData = await response.json() as { data: PublicKeyResponse };
        const { tag, value } = responseData.data;

        console.log('Public Key:', { tag, value });

        return { tag, value };
    }

    // 로그인
    public async login(credentials: any): Promise<string> {
        const headers = new Headers({
            ...BASE_HEADERS,
            "Content-Type": "application/json"
        });

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(credentials)
        };

        const response = await fetchWithCookies(LOGIN_URL, options);

        if (!response.ok) {
            throw new Error(`Beamin Login failed: ${response.statusText}`);
        }

        const responseBody = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseBody);

        const cookies = response.headers.get('set-cookie') || "";

        return cookies;
    }

    // 프로필 조회
    public async getProfile(): Promise<string>{
        const headers = new Headers({
            ...BASE_HEADERS,
            "Service-Channel": "SELF_SERVICE_PC"
        });

        const options = {
            headers: headers
        };

        const response = await fetchWithCookies(PROFILE_URL, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const responseData: any = await response.json();
        console.log('Profile data:', responseData);

        // shopOwnerNumber만 추출하여 반환
        return responseData.shopOwnerNumber;
    }

    // 가게 정보 조회
    public async getShopInfo(cookie: string): Promise<any>{
        const headers = new Headers({
            ...BASE_HEADERS,
            "Cookie": cookie,
            "Service-Channel": "SELF_SERVICE_PC"
        });

        const options = {
            headers: headers
        };

        const response = await fetchWithCookies(`${SHOP_URL}?shopOwnerNo=202302080172`, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch shop info: ${response.statusText}`);
        }

        const responseData: any = await response.json();
        console.log('Shop data:', responseData);

        return responseData;
    }

    // 리뷰 목록 조회
    public async getReviews(params: any, cookie: string): Promise<any>{
        console.log("getReviews cookie: " + cookie);
        const headers = new Headers({
            ...BASE_HEADERS,
            "Cookie": cookie,
            "Service-Channel": "SELF_SERVICE_PC"
        });

        const options = {
            headers: headers,
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await fetchWithCookies(REVIEWS_BASE_URL + `/14104060/reviews?${queryString}`, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const responseData: any = await response.json();
        console.log('Reviews data:', responseData);

        return responseData;
    }

    // 리뷰 답글 등록 
    public async addComment(comments: any, cookie: string) {

        const headers = new Headers({
            ...BASE_HEADERS,
            "Content-Type": "application/json;charset=UTF-8",
            "Cookie": cookie,
            "Service-Channel": "SELF_SERVICE_PC"
        });

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(comments),
            cookie: cookie
        };

        console.log(comments);

        // https://self-api.baemin.com/v1/review/shops/14104060/reviews/comments
        const response = await fetchWithCookies(REVIEWS_BASE_URL + '/14104060/reviews/comments', options);

        if (!response.ok) {
            throw new Error(`Add comment failed: ${response.statusText}`);
        }

        const responseBody = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseBody);
    }
}