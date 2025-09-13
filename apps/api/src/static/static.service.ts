import { Injectable } from '@nestjs/common';
import { StaticRepository } from '@libs/dao/static/static.repository';

@Injectable()
export class StaticService {
  constructor(private readonly staticRepository: StaticRepository) {}

  getStaticDataName(): string[] {
    return Object.keys(this.staticRepository.items).map((it) =>
      it.replaceAll('Data', '').replaceAll('Repository', ''),
    );
  }

  getStaticData(name: string): object[] {
    const dataName = `Data${name}Repository`;

    return this.staticRepository.items[dataName].values();
  }

  getStaticDataById(name: string, id: number): object {
    const dataName = `Data${name}Repository`;

    return this.staticRepository.items[dataName].findById(id);
  }

  getStaticDataByQuery(
    name: string,
    queryString: Record<string, string>,
  ): object {
    const dataName = `Data${name}Repository`;
    const query: Record<string, any[]> = {};

    Object.keys(queryString).map((it) => {
      const element = queryString[it].split(',');
      query[it] = [...element, ...element.map(Number)];
    });

    return this.staticRepository.items[dataName].query(query);
  }
}
