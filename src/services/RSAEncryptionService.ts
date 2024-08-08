import { BigInteger } from 'jsbn';
import crypto from 'crypto';

export default class RSAEncryptionService {
    private static instance: RSAEncryptionService;
    private n: BigInteger | null = null;
    private e: number | null = null;

    private constructor() {}

    // 싱글톤 패턴 구현
    public static getInstance(): RSAEncryptionService {
        if (!RSAEncryptionService.instance) {
            RSAEncryptionService.instance = new RSAEncryptionService();
        }
        return RSAEncryptionService.instance;
    }

    // 공개키 설정
    public setPublic(n: string, e: string) {
        this.n = new BigInteger(n, 16);
        this.e = parseInt(e, 16);
    }

    private doPublic(x: BigInteger): BigInteger {
        if (this.e === null || this.n === null) {
            throw new Error('Public key is not set.');
        }
        return x.modPowInt(this.e, this.n);
    }

    // 랜덤 바이트 생성
    private getRandomBytes(size: number): Buffer {
        return crypto.randomBytes(size);
    }

    // 패딩 생성 후 메세지에 추가
    private customPkcs1Pad(message: string, k: number): Buffer {
        const messageBytes = Buffer.from(message, 'utf-8');
        const mLen = messageBytes.length;

        if (k < mLen + 11) {
            throw new Error("Message too long for RSA key size");
        }

        const paddingLength = k - mLen - 3;
        let padding = Buffer.alloc(paddingLength);

        let i = 0;
        while (i < paddingLength) {
            const byte = this.getRandomBytes(1)[0];
            if (byte !== 0) {
                padding[i++] = byte;
            }
        }

        const paddedMessage = Buffer.concat([
            Buffer.from([0x00, 0x02]),
            padding,
            Buffer.from([0x00]),
            messageBytes
        ], k);

        console.log(`k: ${k}`);
        console.log('Message bytes (hex):', messageBytes.toString('hex'));
        console.log('Padding (hex):', padding.toString('hex'));
        console.log('Padded message (hex):', paddedMessage.toString('hex'));
        console.log('Padded message length:', paddedMessage.length);
        console.log('Padded message (Base64):', paddedMessage.toString('base64'));

        return paddedMessage;
    }

    // 메세지 암호화
    public encrypt(message: string): string | null {
        if (this.n === null) {
            throw new Error('Public key is not set.');
        }

        const bitLength = this.n.bitLength();
        const k = Math.ceil(bitLength / 8);
        console.log('Bit length:', bitLength);
        console.log('Calculated k value:', k);

        const paddedMessage = this.customPkcs1Pad(message, k);

        const mInt = new BigInteger(paddedMessage.toString('hex'), 16);
        console.log('Message as integer:', mInt.toString(10));

        const cInt = this.doPublic(mInt);
        console.log('Encrypted integer:', cInt.toString(10));

        let encryptedHex = cInt.toString(16);
        if (encryptedHex.length % 2 === 1) {
            encryptedHex = '0' + encryptedHex;
        }

        console.log('Encrypted message (hex):', encryptedHex);

        return encryptedHex;
    }
}