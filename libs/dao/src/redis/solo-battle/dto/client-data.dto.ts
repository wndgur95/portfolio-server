export class ClientDataDto {
  clientId: string;
  battleId?: string;
  userId?: number | string;
  connectedAt: number;
  status: string;

  static create(partial?: Partial<ClientDataDto>): ClientDataDto {
    return Object.assign(new ClientDataDto(), partial);
  }
}
