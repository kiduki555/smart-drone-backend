import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { DroneService } from "./drone.service";
import { RegisterDroneDto } from "./dto/register-drone.dto";
import { UpdateDroneDto } from "./dto/update-drone.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import { DroneResponseDto } from "./dto/drone-response.dto";
import { JwtAuthGuard } from "../security/guards/jwt-auth.guard";
import { RolesGuard } from "../security/guards/roles.guard";
import { Roles } from "../security/decorators/roles.decorator";
import { USER_ROLES } from "../security/security.constants";

/**
 * 드론 관련 API를 제공하는 컨트롤러
 */
@ApiTags("Drone")
@Controller("drones")
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  /**
   * 새 드론을 등록합니다
   */
  @Post("register")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.OPERATOR)
  @ApiOperation({ summary: "Register a new drone" })
  @ApiResponse({
    status: 201,
    description: "Drone registered successfully",
    type: DroneResponseDto,
  })
  async register(@Body() dto: RegisterDroneDto): Promise<DroneResponseDto> {
    const drone = await this.droneService.registerDrone(dto);
    return this.mapToResponseDto(drone);
  }

  /**
   * SysID로 드론을 조회합니다
   */
  @Get(":sysid")
  @ApiOperation({ summary: "Get drone by sysid" })
  @ApiResponse({
    status: 200,
    description: "Drone found",
    type: DroneResponseDto,
  })
  async getBySysId(
    @Param("sysid", ParseIntPipe) sysid: number
  ): Promise<DroneResponseDto> {
    const drone = await this.droneService.getDroneBySysId(sysid);
    return this.mapToResponseDto(drone);
  }

  /**
   * DroneID로 드론을 조회합니다
   */
  @Get("id/:droneId")
  @ApiOperation({ summary: "Get drone by droneId" })
  @ApiResponse({
    status: 200,
    description: "Drone found",
    type: DroneResponseDto,
  })
  async getByDroneId(
    @Param("droneId") droneId: string
  ): Promise<DroneResponseDto> {
    const drone = await this.droneService.getDroneByDroneId(droneId);
    return this.mapToResponseDto(drone);
  }

  /**
   * 드론의 활성 모듈을 업데이트합니다
   */
  @Patch("module")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.OPERATOR)
  @ApiOperation({ summary: "Update drone active module" })
  @ApiResponse({ status: 200, description: "Module updated successfully" })
  async updateModule(
    @Body() dto: UpdateModuleDto
  ): Promise<{ success: boolean }> {
    await this.droneService.updateActiveModule(dto);
    return { success: true };
  }

  /**
   * 드론 정보를 업데이트합니다
   */
  @Patch(":droneId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.OPERATOR)
  @ApiOperation({ summary: "Update drone information" })
  @ApiResponse({
    status: 200,
    description: "Drone updated successfully",
    type: DroneResponseDto,
  })
  async updateDrone(
    @Param("droneId") droneId: string,
    @Body() dto: UpdateDroneDto
  ): Promise<DroneResponseDto> {
    const drone = await this.droneService.updateDrone(droneId, dto);
    return this.mapToResponseDto(drone);
  }

  /**
   * 모든 드론을 조회합니다
   */
  @Get()
  @ApiOperation({ summary: "Get all drones" })
  @ApiResponse({
    status: 200,
    description: "List of drones",
    type: [DroneResponseDto],
  })
  async getAll(@Query("active") active?: boolean): Promise<DroneResponseDto[]> {
    const drones = await this.droneService.getAllDrones(active);
    return drones.map((drone) => this.mapToResponseDto(drone));
  }

  /**
   * 드론을 삭제합니다
   */
  @Delete(":droneId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({ summary: "Delete a drone" })
  @ApiResponse({ status: 200, description: "Drone deleted successfully" })
  async delete(
    @Param("droneId") droneId: string
  ): Promise<{ success: boolean }> {
    await this.droneService.deleteDrone(droneId);
    return { success: true };
  }

  /**
   * 특정 모듈을 사용하는 드론을 조회합니다
   */
  @Get("module/:moduleType")
  @ApiOperation({ summary: "Get drones by module type" })
  @ApiResponse({
    status: 200,
    description: "List of drones using the module",
    type: [DroneResponseDto],
  })
  async getByModule(
    @Param("moduleType") moduleType: string
  ): Promise<DroneResponseDto[]> {
    const drones = await this.droneService.getDronesByModule(moduleType);
    return drones.map((drone) => this.mapToResponseDto(drone));
  }

  /**
   * 드론 문서를 응답 DTO로 변환합니다
   */
  private mapToResponseDto(drone: any): DroneResponseDto {
    return {
      droneId: drone.droneId,
      name: drone.name,
      sysid: drone.sysid,
      ip: drone.ip,
      port: drone.port,
      color: drone.color,
      activeModule: drone.activeModule,
      active: drone.active,
      status: drone.status,
      metadata: drone.metadata,
      createdAt: drone.createdAt,
      updatedAt: drone.updatedAt,
    };
  }
}
