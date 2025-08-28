import { randomUUID } from 'crypto';

// database 필드는 세션스토어에는 저장하지 않고 gameDbId 만 가지고
// ContextProvider.getSession 에서 생성(계산)되는 값 입니다.
export class Session {
  id?: string;
  nid: string;
  userId: number;
  gameDbId: number;
  database?: string;
  timeOffset?: number;
  block?: boolean;
  sequence?: number;
  sequenceResult?: string; // TODO // 세션에서 분리해서 별도로 관리

  static create(session: Session): Session {
    return Object.assign(new this(), {
      id: randomUUID(),
      sequence: 0,
      ...session,
    });
  }
}
