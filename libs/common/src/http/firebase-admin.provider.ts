import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export interface FirebaseUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class FirebaseAdminProvider {
  constructor(private readonly config: ConfigService) {}

  /**
   * Firebase Admin SDK 초기화
   */
  initializeFirebaseAdmin(): void {
    if (!admin.apps.length) {
      const serviceAccount = {
        projectId: this.config.get('FIREBASE_PROJECT_ID'),
        privateKeyId: this.config.get('FIREBASE_PRIVATE_KEY_ID'),
        privateKey: this.config.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        clientEmail: this.config.get('FIREBASE_CLIENT_EMAIL'),
        clientId: this.config.get('FIREBASE_CLIENT_ID'),
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: this.config.get('FIREBASE_PROJECT_ID'),
      });
    }
  }

  /**
   * Firebase ID Token 검증
   */
  async verifyIdToken(idToken: string): Promise<FirebaseUserInfo> {
    try {
      this.initializeFirebaseAdmin();
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      return {
        sub: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        picture: decodedToken.picture,
      };
    } catch (error) {
      console.error('Firebase ID Token verification error:', error);
      throw new UnauthorizedException('Firebase ID Token verification failed');
    }
  }

  /**
   * Firebase 사용자 정보 조회
   */
  async getUserInfo(uid: string): Promise<admin.auth.UserRecord> {
    try {
      this.initializeFirebaseAdmin();
      return await admin.auth().getUser(uid);
    } catch (error) {
      console.error('Firebase getUser error:', error);
      throw new UnauthorizedException('Failed to get Firebase user info');
    }
  }
} 