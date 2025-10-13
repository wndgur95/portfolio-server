import { Injectable } from '@nestjs/common';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { Erc1155ClaimMerkleTreeProvider } from '@libs/dao/batch/common/erc1155-claim-merkle-tree/erc1155-claim-merkle-tree.provider';
import { Erc1155ClaimProvider } from '@libs/dao/batch/common/erc1155-claim/erc1155-claim.provider';
import {
  CLAIM_STATUS,
  CONTRACT,
  LOG_STATUS,
} from '@libs/common/constants/contract.contstants';
import { keccak256, solidityKeccak256 } from 'ethers/lib/utils';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { MerkleTree } from 'merkletreejs';
import { BATCH_MESSAGE_TYPE } from '../message-kafka/interfaces/message-kafka-event.interface';
import { MessageProvider } from '../message/message.provider';
import { ClaimErc1155LogProvider } from '@libs/dao/batch/common/claim-erc1155-log/claim-erc1155-log.provider';

@Injectable()
export class Erc1155Service {
  constructor(
    private readonly erc1155ClaimProvider: Erc1155ClaimProvider,
    private readonly erc1155ClaimMerkleTreeProvider: Erc1155ClaimMerkleTreeProvider,
    private readonly claimErc1155LogProvider: ClaimErc1155LogProvider,
    private readonly messageProvider: MessageProvider,
    private readonly web3: Web3Provider,
  ) {}

  @TransactionalEx(DB_NAME.BATCH)
  async makeMerkleTree(): Promise<void> {
    const queues = await this.erc1155ClaimProvider.repository.findByStatus(
      CLAIM_STATUS.REGISTERED,
    );

    if (!queues.length) return;

    const leave = [];
    const userIds = new Set([]);
    const type = ['uint256', 'address', 'uint8', 'uint256', 'uint256'];

    for (const queue of queues) {
      if (queue.address.slice(0, 2) !== '0x') {
        queue.status = CLAIM_STATUS.PROCESSED;
        continue;
      }

      queue.treeProof = solidityKeccak256(type, [
        queue.id,
        queue.address,
        queue.claimType,
        queue.tokenId,
        queue.amount,
      ]);
      leave.push(queue.treeProof);
      userIds.add(queue.userId);
    }

    if (leave.length) {
      const hashFn = (data): string => keccak256(data).slice(2);
      const tree = new MerkleTree(leave, hashFn, { sort: true });
      const merkelTreeRoot =
        await this.erc1155ClaimMerkleTreeProvider.repository.save(
          this.erc1155ClaimMerkleTreeProvider.createEntity({
            title: `${queues[0].id} ~ ${queues[queues.length - 1].id}`,
            treeRoot: tree.getHexRoot(),
          }),
        );

      queues
        .filter((it) => {
          return it.address.slice(0, 2) === '0x';
        })
        .map((it) => {
          it.treeRound = merkelTreeRoot.id;
          it.status = CLAIM_STATUS.MAKE_MERKLE_TREE;
        });

      await this.erc1155ClaimMerkleTreeProvider.repository.save(queues, {
        reload: false,
      });

      this.messageProvider.sendMessage(
        BATCH_MESSAGE_TYPE.ERC1155_CLAIM,
        [...userIds],
        '머클트리를 생성했습니다.',
      );
    }
  }

  @TransactionalEx(DB_NAME.BATCH)
  async setMerkleTree(): Promise<void> {
    const merkleTrees =
      await this.erc1155ClaimMerkleTreeProvider.repository.findByStatus(
        LOG_STATUS.REGISTERED,
      );

    if (!merkleTrees.length) return;

    const roots = [];
    const treeIds = [];
    for (const merkleTree of merkleTrees) {
      roots.push([merkleTree.id, merkleTree.treeRoot]);
      treeIds.push(merkleTree.id);
    }
    const claims =
      await this.erc1155ClaimProvider.repository.findByTreeRounds(treeIds);
    const storage = await this.web3.provider.createContract(
      CONTRACT.ERC1155_CLAIM_PROOF,
    );
    const tx = await storage.web3.methods.setRootList(roots);
    await this.web3.provider.signAndSendTransaction(storage, tx);

    const treeRounds = merkleTrees.map((it) => {
      return it.id;
    });

    await this.erc1155ClaimMerkleTreeProvider.repository.updateStatus(
      treeRounds,
      LOG_STATUS.PROCESSED,
    );

    await this.erc1155ClaimProvider.repository.updateStatus(
      treeRounds,
      CLAIM_STATUS.SET_MERKLE_TREE,
    );

    this.messageProvider.sendMessage(
      BATCH_MESSAGE_TYPE.ERC1155_CLAIM,
      [...new Set(claims.map((it) => it.userId))],
      '머클트리를 주입했습니다.',
    );
  }

  @TransactionalEx(DB_NAME.BATCH)
  async claimErc1155(): Promise<void> {
    const claimErc1155 =
      await this.claimErc1155LogProvider.repository.findByStatus(
        LOG_STATUS.REGISTERED,
      );

    if (!claimErc1155.length) return;

    const claimIds = claimErc1155.map((it) => it.claimId);

    await this.erc1155ClaimProvider.repository.updateStatus(
      claimIds,
      CLAIM_STATUS.PROCESSED,
    );

    await this.claimErc1155LogProvider.repository.updateStatus(
      claimErc1155.map((it) => it.id),
    );
  }
}
