import { INTERNAL_ERROR_CODE as e } from './internal-error-code.constants';

export const INTERNAL_ERROR_CODE_DESC = {
  // SESSION
  [e.SESSION_NOT_FOUND]: '유효하지 않은 세션 정보 : %P',
  [e.SESSION_RE_LOGIN]: '다른 기기에서 재 로그인',
  [e.SESSION_NOT_EXIST_ACCOUNT_KEY_IN_HEADER]:
    '세션 정보가 헤더에 포함 되어 있지 않음',
  [e.SESSION_DECODE_FAIL]: '세션 복호화 실패',
  [e.SESSION_SEQUENCE_NOT_FOUND]: '유효하지 않은 시퀀스',

  [e.SUPER_ROLES_CHANGE_IMPOSSIBILITY]: '슈퍼 유저는 변경이 불가능합니다.',

  [e.API_KEY_NOT_VALID]: '유효하지 않은 api key',
  [e.AUTH_SERVER_NETWORK_ERROR]: '%P',
  [e.API_SECURITY_NF_TOKEN_INVALIDATE]: '유효하지 않은 nf token',

  [e.AUTH_FAILED_VERIFY_CHALLENGE]: '챌린지 인증 실페',
  [e.AUTH_CHALLENGE_TIME_EXPIRED]: '챌린지 유효시간 만료',
  [e.AUTH_UNVERIFIED_SIGNATURE]: '메인넷 서명 실패',
  [e.AUTH_MISMATCH_WALLET_ADDRESS]: '지갑 주소 미 일치',
  [e.AUTH_UNVERIFIED_SIGNATURE_MISMATCH_ADDRESS]:
    'address mismatch 메인넷 서명 실패',

  // USER DETAIL
  [e.USER_DETAIL_NOT_FOUND]: '유저 상세 정보를 찾을 수 없음',
  [e.USER_DETAIL_UNKNOWN_CURRENCY_TYPE]: '확인 되지 않은 통화',
  [e.USER_DETAIL_CURRENCY_GOLD_NOT_ENOUGH]: '골드 부족',
  [e.USER_DETAIL_CURRENCY_CASH_NOT_ENOUGH]: '캐시 부족',

  [e.MONGO_LOG_DATA_PARSE_ERROR]: '로그 데이터 파싱 에러',
  [e.MONGO_LOG_DATA_EMPTY]: '로그 데이터 empty',
  [e.MONGO_LOG_UNSUPPORTED_GAME_CODE]: '지원하지 않는 게임 코드',

  [e.CHARACTER_NOT_FOUND]: '%P 캐릭터 정보를 찾을 수 없습니다.',
  [e.CHARACTER_NOT_ENOUGH]: '%P 캐릭터가 부족합니다.',
  [e.CHARACTER_LEVEL_NOT_MATCH]: '%P 캐릭터 레벨이 다릅니다.',

  [e.BATTLE_NOT_VALID]: '전투가 유효하지 않습니다.',

  // MISSION
  [e.MISSION_NOT_FOUND]: '미션 정보 찾을 수 없음',
  [e.MISSION_NOT_CLEARED]: '미션 완료 안 됨',
  [e.MISSION_ALREADY_RECEIVE_REWARD]: '미션 이미 보상 수령',
  [e.MISSION_UNKNOWN_TYPE]: '확인 되지 않은 미션 타입',
  [e.MISSION_CAN_NOT_INIT_TYPE]: '초기화 할 수 없는 타입',
  [e.MISSION_ALREADY_RECEIVE_POINT_REWARD]: '별포인트 보상 이미 수령',
  [e.MISSION_NOT_ENOUGH_POINT]: '별포인트 부족',
  [e.MISSION_PREV_REWARD_NOT_RECEIVED]: '이전 미션의 보상을 받지 않음',

  [e.USER_MISMATCHED_CURRENT_USER]: '본인이 아닙니다.',
  [e.USER_CONFLICT_EMAIL]: '이미 이메일이 존재합니다.',
  [e.USER_NOT_SATISFY_PASSWORD_POLICY]: '비밀번호가 정책에 맞지 않습니다.',
  [e.USER_EMPTY_NAME]: '이름이 비어있습니다.',
  [e.USER_MISMATCHED_EMAIL]: '이메일이 다릅니다.',
  [e.USER_MISMATCHED_PASSWORD]: '비밀번호가 틀렸습니다.',
  [e.USER_NOT_ACTIVATED]: '활성화 유저가 아닙니다.',
  [e.USER_UPDATE_FAILED]: '업데이트에 실패했습니다.',
  [e.USER_NOT_FOUND]: '유저가 없습니다.',
  [e.USER_BLOCK]: '블록 유저',
  [e.LOGIN_METHOD_NOT_VALID]: '계정의 로그인 방식이 잘못됬습니다.',

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
  [e.DATA_INVALID]: '유효하지 않은 STATIC 데이터 : %P',
  [e.DATA_NOT_OBJECT]: 'object 형식이 아닙니다.',

  // Redis
  [e.REDIS_MESSAGE_HANDLE_FAIL]: 'redis 데이터 메세지 핸들링 실패',

  // Database
  [e.DB_TRANSACTION_TEST_ERROR]: 'transaction 확인을 위한 에러 에러포인트 : %P',
  [e.DB_USER_LEVEL_LOCK_NOT_RELEASE]: 'db game level lock 미 해제',
  [e.DB_UPDATE_FAILED]: 'db 업데이트 실패',
  [e.UNKNOWN_FATAL_ERROR]: '알 수 없는 에러(서버에서 의도하지 않음, 확인필요)',
} as const;
