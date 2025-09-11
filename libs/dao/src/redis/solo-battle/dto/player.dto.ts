export class CharacterStatDto {
  attack: number;
  defence: number;
  moveSpeed: number;
  attackSpeed: number;
  weaponCount: number;
  hp: number;

  static create(partial?: Partial<CharacterStatDto>): CharacterStatDto {
    return Object.assign(new CharacterStatDto(), partial);
  }
}

export class PlayerDto {
  level: number;
  kill: number;
  nextLevel: number;
  exp: number;

  stats: CharacterStatDto;

  static create(partial?: Partial<PlayerDto>): PlayerDto {
    return Object.assign(new PlayerDto(), partial);
  }
}
