// 외부 라이브러리
import { ApiProperty } from "@nestjs/swagger";

/**
 * 드론 정보 응답 DTO
 */
export class DroneResponseDto {
  @ApiProperty()
  droneId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sysid: number;

  @ApiProperty()
  ip: string;

  @ApiProperty()
  port: number;

  @ApiProperty()
  color: string;

  @ApiProperty()
  activeModule: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
