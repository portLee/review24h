declare module 'jsbn' {
    export class BigInteger {
        constructor(a: number[] | string, b?: number);

        bitLength(): number;
        intValue(): number;
        toString(base?: number): string;
        modPowInt(e: number, m: BigInteger): BigInteger;
    }
}