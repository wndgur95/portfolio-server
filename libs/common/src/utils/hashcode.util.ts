import * as crypto from 'crypto';
import { AES, enc } from 'crypto-js';

export function generateAuthentication(): string {
  return Math.random().toString().substring(2, 8);
}

export function generateUsername(length = 8): string {
  const codes = [];
  for (let i = 0; i < 10; ++i) {
    codes.push(String.fromCharCode('0'.charCodeAt(0) + i));
  }
  for (let i = 0; i < 26; ++i) {
    codes.push(String.fromCharCode('a'.charCodeAt(0) + i));
  }

  const result = ['L', 'X', 'N'];
  for (let i = 0; i < length; ++i) {
    const random = Math.floor(Math.random() * codes.length);
    result.push(codes[random]);
  }

  return result.join('');
}

export function generateHashToken(
  length = 6,
  encoding: BufferEncoding = 'hex',
): string {
  return crypto.randomBytes(length / 2).toString(encoding);
}

export function generateAccessToken(): string {
  return crypto
    .createHmac('sha512', crypto.randomBytes(16).toString('base64'))
    .digest('base64');
}

export function encodeChallenge(data: any, privateKey: string): string {
  return AES.encrypt(JSON.stringify(data), privateKey).toString();
}

export function decodeChallenge(token: string, privateKey: string): string {
  return AES.decrypt(token, privateKey).toString(enc.Utf8);
}
