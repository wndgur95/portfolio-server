import * as CryptoJS from 'crypto-js';

export class EncryptUtil {
  /**
   * payload 암호화
   */
  static encode(payload: any, key: string): string {
    const plainText = JSON.stringify(payload);

    return CryptoJS.AES.encrypt(plainText, key).toString();
  }

  /**
   * payload 복호화
   */
  static decode(ciphertext: string, key: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);

    const result = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(result);
  }
}
