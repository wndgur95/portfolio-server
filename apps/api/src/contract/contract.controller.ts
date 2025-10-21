import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { JwtWeb3Guard } from '../auth/guard/jwt-web3.guard';
import { ContractService } from './contract.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity';
import { GetContractOutDto } from './dto/get-contract-out.dto';
import { GetContractInDto } from './dto/get-contract-in.dto';

@ApiTags('contract')
@Controller('api/contract')
@ApiBearerAuth('jwt-web3')
@UseGuards(JwtWeb3Guard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}
  @Get()
  @ApiResponseEntity({
    type: GetContractOutDto,
    summary: 'smart contract 조회',
  })
  async getContract(
    @Query() getContractInDto: GetContractInDto,
  ): Promise<ResponseEntity<GetContractOutDto>> {
    const getContractOutDto = await this.contractService.getContract(
      getContractInDto.name,
    );
    return ResponseEntity.ok().body(getContractOutDto);
  }
}
