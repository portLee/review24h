import jwt, {JwtPayload} from 'jsonwebtoken';

interface SignOption {
    expiresIn?: string | number;
}

const DEFAULT_ACCESS_TOKEN_SIGN_OPTION: SignOption = {
    expiresIn: '1h',
  };
  

const DEFAULT_REFRESH_TOKEN_SIGN_OPTION: SignOption = {
    expiresIn: '30d', // 30일 유효한 Refresh Token 설정
  };



// 액세스토큰 생성
export function signJwtAccessToken(payload: JwtPayload, options: SignOption = DEFAULT_ACCESS_TOKEN_SIGN_OPTION) {
    const secret_key = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret_key!, options);
    return token;
  }

// 리프레쉬 토큰 생성
export function createRefreshToken(payload: JwtPayload){
    const secret_key = process.env.JWT_SECRET;
    const refreshToken = jwt.sign(payload, secret_key!, DEFAULT_REFRESH_TOKEN_SIGN_OPTION);
    return refreshToken;
}

  // jwt 검증
export function verifyJwt(token: string) {
    try {
        const secret_key = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret_key!);
        return decoded as JwtPayload;
    } catch (error) {
        console.log(error);
        return null;
    }
}