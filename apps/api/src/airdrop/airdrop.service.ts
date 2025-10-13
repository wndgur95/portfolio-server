import { Injectable } from '@nestjs/common';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { TimeUtil } from '@libs/common/utils/time.util';
import {
  CLAIM_STATUS,
  LOG_STATUS,
} from '@libs/common/constants/contract.contstants';
import { CoinAirdropQueueProvider } from '@libs/dao/batch/common/coin-airdrop-queue/coin-airdrop-queue.provider';
import { Erc1155ClaimProvider } from '@libs/dao/batch/common/erc1155-claim/erc1155-claim.provider';
import { Erc1155ProofInDto } from './dto/erc1155-proof-in.dto';
import { Erc1155ClaimOutDto } from './dto/erc1155-claim-out.dto';
import { keccak256 } from 'ethers/lib/utils';
import { MerkleTree } from 'merkletreejs';

@Injectable()
export class AirdropService {
  constructor(
    private readonly coinAirdropQueueProvider: CoinAirdropQueueProvider,
    private readonly erc1155ClaimProvider: Erc1155ClaimProvider,
  ) {}

  @Transactional(DB_NAME.BATCH)
  async airdropCoinQueueRegister(): Promise<void> {
    const { address, userId } = ContextProvider.getJwt();
    const now = ContextProvider.getNow();

    const queue =
      (await this.coinAirdropQueueProvider.repository.findByAddress(address)) ??
      this.coinAirdropQueueProvider.createEntity({
        userId: userId,
        address: address,
      });

    if (queue.receivedAt && !TimeUtil.isChangeDay(queue.receivedAt, now)) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.TODAY_ALREADY_RECEIVED_AIRDROP,
      );
    }

    queue.status = LOG_STATUS.REGISTERED;

    await this.coinAirdropQueueProvider.repository.save(queue, {
      reload: false,
    });
  }

  @Transactional(DB_NAME.BATCH)
  async erc1155ClaimRegister(
    erc1155ProofInDto: Erc1155ProofInDto,
  ): Promise<void> {
    const { address, userId } = ContextProvider.getJwt();
    const { claimType, tokenId, amount } = erc1155ProofInDto;

    await this.erc1155ClaimProvider.repository.insert(
      this.erc1155ClaimProvider.createEntity({
        userId,
        address,
        claimType,
        tokenId,
        amount,
      }),
    );
  }

  async erc1155Claim(): Promise<Erc1155ClaimOutDto[]> {
    const { address } = ContextProvider.getJwt();

    const claims =
      await this.erc1155ClaimProvider.repository.findByAddressAndStatus(
        address,
        CLAIM_STATUS.SET_MERKLE_TREE,
      );

    return Promise.all(
      claims.map(async (claim) => {
        return Erc1155ClaimOutDto.of({
          id: claim.id,
          claimType: claim.claimType,
          tokenId: claim.tokenId,
          amount: claim.amount,
          round: claim.treeRound,
          proof: await this._getProof(claim.treeRound, claim.treeProof),
        });
      }),
    );
  }

  private async _getProof(
    treeRound: number,
    treeProof: string,
  ): Promise<string[]> {
    const missionProofs =
      await this.erc1155ClaimProvider.repository.findByTreeRound(treeRound);
    const hashFn = (data: string): string => keccak256(data).slice(2);
    const treeLeaves = new MerkleTree(
      missionProofs.map((it) => {
        return it.treeProof;
      }),
      hashFn,
      { sort: true },
    );
    return treeLeaves.getHexProof(treeProof);
  }
}
