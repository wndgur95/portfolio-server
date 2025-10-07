import { Injectable } from '@nestjs/common';
import { Web3Provider } from '@libs/common/provider/web3/web3.provider';
import { CONTRACT } from '@libs/common/constants/contract.contstants';
import { DataShapeTokenRepository } from '@libs/dao/static/data-shape-token/data-shape-token.repository';
import { DataNumberTokenRepository } from '@libs/dao/static/data-number-token/data-number-token.repository';
import { DataGachaTokenRepository } from '@libs/dao/static/data-gacha-token/data-gacha-token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly web3: Web3Provider,
    private readonly dataShapeTokenRepository: DataShapeTokenRepository,
    private readonly dataNumberTokenRepository: DataNumberTokenRepository,
    private readonly dataGachaTokenRepository: DataGachaTokenRepository,
  ) {}

  async getShapeData(): Promise<any[]> {
    const ids = this.dataShapeTokenRepository.values().map((it) => it.ID);
    const dataContract = await this.web3.provider.createContract(
      CONTRACT.SHAPE_DATA,
    );
    const contractData = [];
    const shapes = await dataContract.web3.methods.getShapes(ids).call();

    for (const data of shapes) {
      contractData.push({
        id: data[0],
        name: data[1],
        tier: data[2],
        idValid: data[3],
      });
    }

    return contractData;
  }

  async setShapeData(): Promise<void> {
    const data = this.dataShapeTokenRepository.values();
    const dataContract = await this.web3.provider.createContract(
      CONTRACT.SHAPE_DATA,
    );

    const shapeData = [];

    data.forEach((it) => {
      shapeData.push([it.ID, it.NAME, it.TIER, true]);
    });

    const tx = await dataContract.web3.methods.setShapeData(shapeData);
    const result = await this.web3.provider.signAndSendTransaction(
      dataContract,
      tx,
    );
    // eslint-disable-next-line no-console
    console.log(result);
  }

  async getNumberData(): Promise<any[]> {
    const ids = this.dataNumberTokenRepository.values().map((it) => it.ID);
    const dataContract = await this.web3.provider.createContract(
      CONTRACT.NUMBER_DATA,
    );
    const contractData = [];
    const numbers = await dataContract.web3.methods.getNumbers(ids).call();
    for (const data of numbers) {
      contractData.push({
        id: data[0],
        name: data[1],
        tier: data[2],
        idValid: data[3],
      });
    }

    return contractData;
  }

  async setNumberData(): Promise<void> {
    const data = this.dataNumberTokenRepository.values();
    const dataContract = await this.web3.provider.createContract(
      CONTRACT.NUMBER_DATA,
    );

    const numberData = [];

    data.forEach((it) => {
      numberData.push([it.ID, it.NAME, it.TIER, true]);
    });

    const tx = await dataContract.web3.methods.setNumberData(numberData);
    const result = await this.web3.provider.signAndSendTransaction(
      dataContract,
      tx,
    );
    // eslint-disable-next-line no-console
    console.log(result);
  }

  async getGachaData(): Promise<any[]> {
    const ids = this.dataGachaTokenRepository.values().map((it) => it.ID);
    const dataContract = await this.web3.provider.createContract(
      CONTRACT.GACHA_DATA,
    );
    const contractData = [];
    const gachas = await dataContract.web3.methods.getGachas(ids).call();
    for (const data of gachas) {
      contractData.push({
        id: data[0],
        name: data[1],
        gachaType: data[2],
        tierRatio: data[3],
        idValid: data[4],
      });
    }

    return contractData;
  }

  async setGachaData(): Promise<void> {
    const data = this.dataGachaTokenRepository.values();
    const dataContract = await this.web3.provider.createContract(
      CONTRACT.GACHA_DATA,
    );

    const gachaData = [];

    data.forEach((it) => {
      gachaData.push([it.ID, it.NAME, it.GACHA_TYPE, it.TIER_RATIO, true]);
    });

    const tx = await dataContract.web3.methods.setGachaInfos(gachaData);
    const result = await this.web3.provider.signAndSendTransaction(
      dataContract,
      tx,
    );
    // eslint-disable-next-line no-console
    console.log(result);
  }
}
