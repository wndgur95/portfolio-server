export const CHEONGAN_MAP: Record<string, { element: '목' | '화' | '토' | '금' | '수'; name: string }> = {
  갑: { element: '목', name: '갑목(甲木 - 우뚝 솟은 거목)' },
  을: { element: '목', name: '을목(乙木 - 유연한 꽃초)' },
  병: { element: '화', name: '병화(丙火 - 태양의 빛)' },
  정: { element: '화', name: '정화(丁火 - 따뜻한 촛불)' },
  무: { element: '토', name: '무토(戊土 - 웅장한 태산)' },
  기: { element: '토', name: '기토(己土 - 비옥한 논밭)' },
  경: { element: '금', name: '경금(庚金 - 단단한 바위)' },
  신: { element: '금', name: '신금(辛金 - 찬란한 보석)' },
  임: { element: '수', name: '임수(壬水 - 도도한 큰 바다)' },
  계: { element: '수', name: '계수(癸水 - 생명의 단비)' },
};

export const JIJI_MAP: Record<
  string,
  { element: '목' | '화' | '토' | '금' | '수'; season: 'spring' | 'summer' | 'autumn' | 'winter' }
> = {
  인: { element: '목', season: 'spring' },
  묘: { element: '목', season: 'spring' },
  진: { element: '토', season: 'spring' },
  사: { element: '화', season: 'summer' },
  오: { element: '화', season: 'summer' },
  미: { element: '토', season: 'summer' },
  신: { element: '금', season: 'autumn' },
  유: { element: '금', season: 'autumn' },
  술: { element: '토', season: 'autumn' },
  해: { element: '수', season: 'winter' },
  자: { element: '수', season: 'winter' },
  축: { element: '토', season: 'winter' },
};

export const SEASON_NAME_MAP = {
  spring: '봄(春) - 만물이 싹트는 온기',
  summer: '여름(夏) - 작열하는 태양과 성장',
  autumn: '가을(秋) - 결실과 수확의 단단함',
  winter: '겨울(冬) - 응축과 깊은 지혜',
};

export const HOUR_STRING_MAP = [
  '자시 (23:30~01:29)',
  '축시 (01:30~03:29)',
  '인시 (03:30~05:29)',
  '묘시 (05:30~07:29)',
  '진시 (07:30~09:29)',
  '사시 (09:30~11:29)',
  '오시 (11:30~13:29)',
  '미시 (13:30~15:29)',
  '신시 (15:30~17:29)',
  '유시 (17:30~19:29)',
  '술시 (19:30~21:29)',
  '해시 (21:30~23:29)',
];
