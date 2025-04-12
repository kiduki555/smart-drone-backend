// 외부 라이브러리
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

/**
 * 드론 정보 업데이트 요청 DTO
 */
export class UpdateDroneDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(255)
  @IsOptional()
  sysid?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  port?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  activeModule?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
