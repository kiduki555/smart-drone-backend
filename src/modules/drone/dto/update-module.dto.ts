// 외부 라이브러리
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

/**
 * 드론 활성 모듈 업데이트 요청 DTO
 */
export class UpdateModuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  droneId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  activeModule: string;
}
