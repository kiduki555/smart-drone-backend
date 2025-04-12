// 외부 라이브러리
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

/**
 * 드론 등록 요청 DTO
 */
export class RegisterDroneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  droneId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(255)
  sysid: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ip: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ required: false, default: "fire-surveillance" })
  @IsString()
  @IsOptional()
  activeModule?: string = "fire-surveillance";

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean = true;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
