import * as lodash from 'lodash';
import * as fs from 'fs';
import { promisify } from 'util';

let database: string;
let entityName: string;

let singleSnackName: string;
let singleCamelName: string;
let singleDirName: string;
let singleClassName: string;

let pluralSnackName: string;
let pluralCamelName: string;
let pluralDirName: string;
let pluralClassName: string;

const ShardDbName = ['game']

let tablePath: string;
export async function daoGenerator(): Promise<void> {
  const words = lodash.snakeCase(entityName).split('_');
  words[words.length - 1] = applyRules(words[words.length - 1]);

  singleSnackName = lodash.snakeCase(entityName);
  singleCamelName = capitalizeFirstLetter(entityName);
  singleDirName = `${singleSnackName.replaceAll('_', '-')}`;
  singleClassName = capitalizeFirstLetter(singleCamelName);

  pluralSnackName = words.join('_');
  pluralCamelName = lodash.camelCase(pluralSnackName);
  pluralDirName = `${pluralSnackName.replaceAll('_', '-')}`;
  pluralClassName = capitalizeFirstLetter(pluralCamelName);
  tablePath = `libs/dao/src/${database}/${pluralDirName}`;

  await makeDirectory();
  makeEntity();
  makeEntityInterface();
  makeRepositoryInterface();
  makeRepository();
  makeModule();
  makeDto();
}

async function makeDirectory(): Promise<void> {
  const mkdir = promisify(fs.mkdir);
  const dbPath = `libs/dao/src/${database}/`;
  try {
    await mkdir(`${dbPath}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`already created ${dbPath}`);
  }
  try {
    await mkdir(`${tablePath}/`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`already created ${tablePath}/`);
  }
  try {
    await mkdir(`${tablePath}/entities/`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`already created ${tablePath}/entities/`);
  }
  try {
    await mkdir(`${tablePath}/interfaces/`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`already created ${tablePath}/interfaces/`);
  }
  try {
    await mkdir(`${tablePath}/repositories/`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`already created ${tablePath}/repositories/`);
  }
  try {
    await mkdir(`${tablePath}/dto/`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`already created ${tablePath}/dto/`);
  }
}

function makeEntity(): void {
  let data = '';
  data += `import { Entity } from 'typeorm'\n`;
  data += `import { AbstractEntity, BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';\n`;
  data += `import { ${singleClassName} } from '@libs/dao/${database}/${pluralDirName}/interfaces/${singleDirName}.interface';\n\n`;
  data += `@Entity('${singleSnackName}')\n`;
  data += `@BaseTimeEntity()\n`;
  data += `export class ${singleClassName}Entity extends AbstractEntity implements ${singleClassName} {}`;
  fs.writeFileSync(`${tablePath}/entities/${singleDirName}.entity.ts`, data);
}

function makeEntityInterface(): void {
  let data = '';
  data += `import { Domain } from '@libs/common/domain/domain';\n\n`;
  data += `export interface ${singleClassName} extends Domain {}`;
  fs.writeFileSync(
    `${tablePath}/interfaces/${singleDirName}.interface.ts`,
    data,
  );
}

function makeRepositoryInterface(): void {
  let data = `import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";\n`;
  data += `import { ${singleClassName}Entity } from "@libs/dao/${database}/${pluralDirName}/entities/${singleDirName}.entity";\n\n`;
  data += `export interface ${pluralClassName}Repository extends AbstractRepositoryInterface<${singleClassName}Entity> {}\n\n`;
  data += `export const ${pluralClassName}Repository = Symbol('${pluralClassName}Repository');`;
  fs.writeFileSync(
    `${tablePath}/interfaces/${pluralDirName}-repository.interface.ts`,
    data,
  );
}

function makeRepository(): void {
  let data = `import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'\n`;
  data += `import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';\n`;
  data += `import { ${singleClassName}Entity } from '@libs/dao/${database}/${pluralDirName}/entities/${singleDirName}.entity';\n`;
  data += `import { ${pluralClassName}Repository } from '@libs/dao/${database}/${pluralDirName}/interfaces/${pluralDirName}-repository.interface';\n\n`;
  if (ShardDbName.includes(database))
    data += `export type ${pluralClassName}DbRepositories = Record<string, ${pluralClassName}Repository>;\n\n`;
  data += `@EntityRepository(${singleClassName}Entity)\n`;
  data += `export class ${pluralClassName}DbRepository\n`;
  data += `  extends AbstractRepository<${singleClassName}Entity>\n`;
  data += `  implements ${pluralClassName}Repository {}`;
  fs.writeFileSync(
    `${tablePath}/repositories/${pluralDirName}-db.repository.ts`,
    data,
  );
}

function makeModule(): void {
  const firstLetterDatabase = capitalizeFirstLetter(database);
  let data = `import { Module } from '@nestjs/common';\n`;
  data += `import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';\n`;
  data += `import { ${pluralClassName}Repository } from '@libs/dao/${database}/${pluralDirName}/interfaces/${pluralDirName}-repository.interface';\n`;
  data += `import { ${pluralClassName}DbRepository } from '@libs/dao/${database}/${pluralDirName}/repositories/${pluralDirName}-db.repository';\n`;
  if (ShardDbName.includes(database)) {
    data += `import { get${firstLetterDatabase}ShardDatabases } from '@libs/dao/config/${database}/${database}-database-config.util';\n`;
  } else {
    data += `import ${firstLetterDatabase}DatabaseConfig from '@libs/dao/config/${database}/${database}-database.config';\n`;
  }
  data += `import { InjectDataSource } from '@nestjs/typeorm';\n`;
  data += `import { DataSource } from 'typeorm';\n\n`;

  data += `@Module({\n`;
  data += `  imports: [\n`;
  data += `    TypeOrmExModule.forFeatures(\n`;
  data += `      [${pluralClassName}DbRepository],\n`;
  if (ShardDbName.includes(database)) {
    data += `      get${firstLetterDatabase}ShardDatabases,\n`;
  } else {
    data += `      [${firstLetterDatabase}DatabaseConfig().name],\n`;
  }
  data += `    ),\n`;
  data += `  ],\n`;
  data += `  providers: [\n`;
  data += `    {\n`;
  data += `      provide: ${pluralClassName}Repository,\n`;
  data += `      inject: [${pluralClassName}DbRepository],\n`;
  data += `      useFactory: (repo: ${pluralClassName}DbRepository): ${pluralClassName}Repository => repo,\n`;
  data += `    },\n`;
  data += `  ],\n`;
  data += `  exports: [${pluralClassName}Repository],\n`;
  data += `})\n`;
  data += `export class ${pluralClassName}Module {\n`;
  if (ShardDbName.includes(database)) {
    data += `  constructor(\n`;
    data += `    @InjectDataSource(...get${firstLetterDatabase}ShardDatabases)\n`;
    data += `    private readonly dataSources: DataSource[],\n`;
    data += `  ) {}\n\n`;
    data += `  async onModuleDestroy(): Promise<void> {\n`;
    data += `    for (const dataSource of this.dataSources) {\n`;
    data += `      await dataSource.destroy();\n`;
    data += `    }\n`;
    data += `  }\n`;
    data += `}`;
  } else {
    data += `  constructor(\n`;
    data += `    @InjectDataSource(${firstLetterDatabase}DatabaseConfig().name)\n`;
    data += `    private readonly dataSource: DataSource,\n`;
    data += `  ) {}\n\n`;
    data += `  async onModuleDestroy(): Promise<void> {\n`;
    data += `    await this.dataSource.destroy();\n`;
    data += `  }\n`;
    data += `}`;
  }

  fs.writeFileSync(`${tablePath}/${pluralDirName}.module.ts`, data);
}

function makeDto(): void {
  let data = '';
  data += `import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';\n`;
  data += `import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';\n\n`;
  data += `@EntitySerializeImpl()\n`;
  data += `export class ${singleClassName}Dto extends ExcludeBaseTimeDto<${singleClassName}Dto> {}\n`;
  fs.writeFileSync(`${tablePath}/dto/${singleDirName}.dto.ts`, data);
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function applyRules(word: string): string {
  if (irregularPlurals[word]) return irregularPlurals[word];
  for (const rule of rules) {
    if (rule.regex.test(word)) {
      return word.replace(rule.regex, rule.replace);
    }
  }
  return `${word}s`;
}

const rules = [
  { regex: /(s|x|z|ch|sh)$/i, replace: '$1es' },
  { regex: /([^aeiou])y$/i, replace: '$1ies' },
  { regex: /(f|fe)$/i, replace: 'ves' },
  { regex: /o$/i, replace: 'oes' },
];

// 예외적인 경우를 처리하기 위한 사전
const irregularPlurals: Record<string, string> = {
  child: 'children',
  man: 'men',
  woman: 'women',
  mouse: 'mice',
  goose: 'geese',
  tooth: 'teeth',
  foot: 'feet',
  person: 'people',
  cactus: 'cacti',
  focus: 'foci',
  fungus: 'fungi',
  nucleus: 'nuclei',
  syllabus: 'syllabi',
  analysis: 'analyses',
  diagnosis: 'diagnoses',
  oasis: 'oases',
  thesis: 'theses',
  crisis: 'crises',
  phenomenon: 'phenomena',
  criterion: 'criteria',
  datum: 'data',
  series: 'series',
  aircraft: 'aircraft',
  news: 'news',
  shapes: 'shapes',
};

function parseArgs(): void {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    throw new Error('Please provide databases, entityName as arguments.');
  }
  [database, entityName] = args;
  entityName = entityName.replaceAll('-', '_');
  entityName = lodash.camelCase(entityName);
}

async function main(): Promise<void> {
  try {
    parseArgs();
    await daoGenerator();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main().then();
