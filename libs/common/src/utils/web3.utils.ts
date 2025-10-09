import { Log } from 'web3-core';

export const HEX_STANDARD = {
  hex: 16, // 16진수 int
  hex_string: '0x', // 16진수 string
};
export const LOG_USER_ADDRESS_STANDARD = {
  user_address_topic_index: 1, // 로그 생성 유저 address get
  second_topic_index: 2, // event log topic 2
  third_topic_index: 3, // event log topic 3
  user_address_start: 26, // 유저 address 시작 index
  user_address_end: 66, // 유저 address 끝 index
};

export const LOG_DATA_STANDARD = {
  data_start: 2, // '0x' 제거 시작 값
  data_length: 64, // 하나의 데이터의 길이
};

export function getLogData(data: string): any[] {
  const logData = [];

  for (
    let i = LOG_DATA_STANDARD.data_start;
    i < data.length;
    i += LOG_DATA_STANDARD.data_length
  ) {
    logData.push(
      HEX_STANDARD.hex_string +
        data.substring(i, i + LOG_DATA_STANDARD.data_length),
    ); // 0x 와 log 합치기
  }

  return logData;
}

/**
 * 로그 생성 유저 정보 가져오기
 * @param log
 * @private
 */
export function getUserAddress(log: Log): string {
  return (
    HEX_STANDARD.hex_string +
    log.topics[LOG_USER_ADDRESS_STANDARD.user_address_topic_index].substring(
      LOG_USER_ADDRESS_STANDARD.user_address_start,
      LOG_USER_ADDRESS_STANDARD.user_address_end,
    )
  );
}

/**
 * 로그 생성 유저 정보 가져오기
 * @param hash
 * @private
 */
export function getAddress(hash: string): string {
  return (
    HEX_STANDARD.hex_string +
    hash.substring(
      LOG_USER_ADDRESS_STANDARD.user_address_start,
      LOG_USER_ADDRESS_STANDARD.user_address_end,
    )
  );
}

/**
 * 로그 생성 유저 정보 가져오기
 * @param log
 * @private
 */
export function getPreviousUserAddress(log: Log): string {
  return (
    HEX_STANDARD.hex_string +
    log.topics[2].substring(
      LOG_USER_ADDRESS_STANDARD.user_address_start,
      LOG_USER_ADDRESS_STANDARD.user_address_end,
    )
  );
}

export function hexToText(hex: string): string {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    if (hex.substr(i, 2) == '00') {
      break;
    } else if (hex.substr(i, 2) == '0x') {
      continue;
    }

    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}
