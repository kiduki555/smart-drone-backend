// 외부 라이브러리
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UpdateResult } from "mongoose";

// 내부 모듈
import { LoggerService } from "../../common/logger/logger.service";

// 상대 경로 import
import { DroneRepository } from "../database/repositories/drone.repository";
import { RegisterDroneDto } from "./dto/register-drone.dto";
import { UpdateDroneDto } from "./dto/update-drone.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import { DroneDocument } from "../database/schemas/drone.schema";

/**
 * 드론 관련 비즈니스 로직을 처리하는 서비스
 */
@Injectable()
export class DroneService {
  constructor(
    private readonly droneRepository: DroneRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService
  ) {}

  /**
   * 새 드론을 등록합니다
   * @param dto 등록할 드론 데이터
   * @returns 등록된 드론 정보
   */
  async registerDrone(dto: RegisterDroneDto): Promise<DroneDocument> {
    // sysid 중복 체크
    const existingBySysId = await this.droneRepository.findBySysId(dto.sysid);
    if (existingBySysId) {
      throw new ConflictException(
        `Drone with sysid ${dto.sysid} already exists`
      );
    }

    // droneId 중복 체크
    const existingDrone = await this.droneRepository.findByDroneId(dto.droneId);
    if (existingDrone) {
      throw new ConflictException(
        `Drone with id ${dto.droneId} already exists`
      );
    }

    // sysId 중복 체크
    const existingSysId = await this.droneRepository.findBySysId(dto.sysid);
    if (existingSysId) {
      throw new ConflictException(
        `Drone with sysId ${dto.sysid} already exists`
      );
    }

    // name 중복 체크
    const existingName = await this.droneRepository.findByName(dto.name);
    if (existingName) {
      throw new ConflictException(`Drone with name ${dto.name} already exists`);
    }

    // 색상이 없으면 랜덤 생성
    if (!dto.color) {
      dto.color = await this.generateRandomColor();
    } else {
      // color 중복 체크
      const existingColor = await this.droneRepository.findByColor(dto.color);
      if (existingColor) {
        throw new ConflictException(
          `Drone with color ${dto.color} already exists`
        );
      }
    }

    const drone = await this.droneRepository.register(dto);
    this.eventEmitter.emit("drone.registered", drone);
    this.logger.log(`Drone ${drone.droneId} registered successfully`);

    return drone;
  }

  /**
   * SysID로 드론을 조회합니다
   * @param sysid 드론 시스템 ID
   * @returns 조회된 드론 정보
   */
  async getDroneBySysId(sysid: number): Promise<DroneDocument> {
    const drone = await this.droneRepository.findBySysId(sysid);
    if (!drone) {
      throw new NotFoundException(`Drone with sysid ${sysid} not found`);
    }
    return drone;
  }

  /**
   * DroneID로 드론을 조회합니다
   * @param droneId 드론 고유 ID
   * @returns 조회된 드론 정보
   */
  async getDroneByDroneId(droneId: string): Promise<DroneDocument> {
    const drone = await this.droneRepository.findByDroneId(droneId);
    if (!drone) {
      throw new NotFoundException(`Drone with id ${droneId} not found`);
    }
    return drone;
  }

  /**
   * 드론의 활성 모듈을 업데이트합니다
   * @param dto 업데이트 정보
   * @returns 업데이트 결과
   */
  async updateActiveModule(dto: UpdateModuleDto): Promise<UpdateResult> {
    const drone = await this.getDroneByDroneId(dto.droneId);
    const result = await this.droneRepository.updateModule(
      drone.droneId,
      dto.activeModule
    );
    this.eventEmitter.emit("drone.module.updated", {
      droneId: drone.droneId,
      activeModule: dto.activeModule,
    });
    this.logger.log(
      `Drone ${drone.droneId} module updated to ${dto.activeModule}`
    );
    return result;
  }

  /**
   * 드론 정보를 업데이트합니다
   * @param droneId 드론 고유 ID
   * @param dto 업데이트 정보
   * @returns 업데이트된 드론 정보
   */
  async updateDrone(
    droneId: string,
    dto: UpdateDroneDto
  ): Promise<DroneDocument> {
    const drone = await this.getDroneByDroneId(droneId);

    // sysid 업데이트 시 중복 체크
    if (dto.sysid && dto.sysid !== drone.sysid) {
      const existing = await this.droneRepository.findBySysId(dto.sysid);
      if (existing) {
        throw new ConflictException(
          `Drone with sysid ${dto.sysid} already exists`
        );
      }
    }

    const updatedDrone = await this.droneRepository.updateDrone(droneId, dto);
    this.eventEmitter.emit("drone.updated", updatedDrone);
    this.logger.log(`Drone ${droneId} updated successfully`);

    return updatedDrone;
  }

  /**
   * 드론 상태를 업데이트합니다
   * @param sysid 드론 시스템 ID
   * @param status 새로운 상태
   * @returns 업데이트 결과
   */
  async updateStatus(sysid: number, status: string): Promise<UpdateResult> {
    const validStatuses = ["online", "offline", "busy", "error"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const result = await this.droneRepository.updateStatus(sysid, status);
    this.eventEmitter.emit("drone.status.updated", { sysid, status });
    this.logger.log(`Drone with sysid ${sysid} status updated to ${status}`);

    return result;
  }

  /**
   * 모든 드론을 조회합니다
   * @param activeOnly 활성 드론만 조회할지 여부
   * @returns 드론 목록
   */
  async getAllDrones(activeOnly: boolean = false): Promise<DroneDocument[]> {
    const filter = activeOnly ? { active: true } : {};
    return this.droneRepository.findAll(filter);
  }

  /**
   * 드론을 삭제합니다
   * @param droneId 드론 고유 ID
   * @returns 삭제된 드론 정보
   */
  async deleteDrone(droneId: string): Promise<DroneDocument> {
    const drone = await this.getDroneByDroneId(droneId);
    const deletedDrone = await this.droneRepository.delete(droneId);
    this.eventEmitter.emit("drone.deleted", drone);
    this.logger.log(`Drone ${droneId} deleted successfully`);
    return deletedDrone;
  }

  /**
   * 특정 모듈을 사용하는 드론을 조회합니다
   * @param moduleType 모듈 타입
   * @returns 드론 목록
   */
  async getDronesByModule(moduleType: string): Promise<DroneDocument[]> {
    return this.droneRepository.findActiveByModule(moduleType);
  }

  /**
   * 랜덤 색상을 생성합니다
   * @returns HEX 색상 코드
   */
  async generateRandomColor(): Promise<string> {
    const letters = "0123456789ABCDEF";
    let color: string;
    let existingColor: DroneDocument | null;

    // 중복되지 않는 색상을 찾을 때까지 반복
    do {
      color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      existingColor = await this.droneRepository.findByColor(color);
    } while (existingColor);

    return color;
  }
}
