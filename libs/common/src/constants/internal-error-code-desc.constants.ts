import { INTERNAL_ERROR_CODE as e } from './internal-error-code.constants';

export const INTERNAL_ERROR_CODE_DESC = {
  // SESSION
  [e.SESSION_NOT_FOUND]: '유효하지 않은 세션 정보',
  [e.SESSION_RE_LOGIN]: '다른 기기에서 재 로그인',
  [e.SESSION_NOT_EXIST_ACCOUNT_KEY_IN_HEADER]:
    '세션 정보가 헤더에 포함 되어 있지 않음',
  [e.SESSION_DECODE_FAIL]: '세션 복호화 실패',
  [e.SESSION_SEQUENCE_NOT_FOUND]: '유효하지 않은 시퀀스',
  [e.USER_MISMATCHED_CURRENT_USER]: '본인이 아닙니다.',
  [e.USER_CONFLICT_EMAIL]: '이미 이메일이 존재합니다.',
  [e.USER_NOT_SATISFY_PASSWORD_POLICY]:
    '비밀번호가 정책에 맞지 않습니다.',
  [e.USER_EMPTY_NAME]: '이름이 비어있습니다.',
  [e.USER_MISMATCHED_EMAIL]: '이메일이 다릅니다.',
  [e.USER_MISMATCHED_PASSWORD]: '비밀번호가 틀렸습니다.',
  [e.USER_NOT_ACTIVATED]: '활성화 유저가 아닙니다.',
  [e.USER_UPDATE_FAILED]: '업데이트에 실패했습니다.',
  [e.USER_NOT_FOUND]: '유저가 없습니다.',

  // Group
  [e.GROUP_MEMBER_ROLE_INVALID]: '해당 기능은 %P만 가능한 기능입니다.',

  // Friend
  [e.FRIEND_REQUEST_ALREADY_EXIST]: '이미 %P에게 친구 요청한 상태입니다.',
  [e.FRIEND_RESPONSE_ALREADY_EXIST]: '이미 %P에게 친구 요청 받은 상태입니다.',
  [e.FRIEND_ALREADY_EXIST]: '%P은(는) 이미 존재하는 친구입니다.',
  [e.FRIEND_REQUEST_BLOCK]:
    '%P은(는) 차단된 친구입니다. 차단 삭제 후 재시도 부탁드립니다.',
  [e.FRIEND_NOT_EXIST]: '%P은(는) 로그인 한적 없는 유저입니다.',
  [e.RECOMMEND_CODE_NOT_EXIST]: '%P 코드의 친구가 존재하지 않습니다.',
  [e.FRIEND_REQUEST_FRIEND_BLOCK]:
    '%P가 당신과 친구하기 싫어합니다. 친구한테 차단 삭제 요청해보세요',
  [e.FRIEND_REQUEST_ALREADY_RESULT]: '이미 처리된 요청입니다.',
  [e.FRIEND_REQUEST_INVALID]: '유효하지 않은 친구 요청입니다.',

  [e.EXPENDITURE_GROUP_NOT_JOIN]: '가입되어있는 그룹이 아닙니다.',
  [e.EXPENDITURE_NOT_MINE]: '해당 내역은 %P 내역 입니다.',
  [e.EXPENDITURE_INVITE_NOT_FRIEND]: '해당 유저는 친구가 아닙니다.',
  [e.EXPENDITURE_ALREADY_INVITE]: '%P는 이미 초대된 친구입니다.',

  [e.BUG_REPORT_NOT_MINE]: '해당 버그 리포트는 내 리포트가 아닙니다.',
  [e.QUESTION_NOT_MINE]: '해당 질문은 내 질문이 아닙니다.',
  [e.PATCH_NOTE_CUD_ONLY_ADMIN]:
    '패치노트는 운영자만 create, update, delete 할 수 있습니다..',

  [e.IDEA_INCLUDE_BAD_WORD]: '%P에 사용 할 수 없는 단어가 들어가있습니다. %P',
  [e.IDEA_ALREADY_DO_IT]: '이미 해줘! 상태입니다.',
  [e.IDEA_NOT_MINE]: '해당 아이디어는 내 아이디어가 아닙니다.',
  [e.IDEA_COMMENT_NOT_MINE]: '해당 댓글은 내 댓글이 아닙니다.',

  [e.KNOW_HOW_INCLUDE_BAD_WORD]:
    '%P에 사용 할 수 없는 단어가 들어가있습니다. %P',
  [e.KNOW_HOW_ALREADY_DO_IT]: '이미 추천! 상태입니다.',
  [e.KNOW_HOW_NOT_MINE]: '해당 노하우는 내 노하우가 아닙니다.',
  [e.KNOW_HOW_COMMENT_NOT_MINE]: '해당 댓글은 내 댓글이 아닙니다.',

  // DATA
  [e.DATA_INVALID]: '유효하지 않은 STATIC 데이터',

  // Database
  [e.DB_USER_LEVEL_LOCK_NOT_RELEASE]: 'db user level lock 미 해제',
  [e.DB_UPDATE_FAILED]: 'db 업데이트 실패',
  [e.UNKNOWN_FATAL_ERROR]: '알 수 없는 에러(서버에서 의도하지 않음, 확인필요)',
} as const;

export const BATCH_INTERNAL_ERROR_CODE_DESC = {} as const;
