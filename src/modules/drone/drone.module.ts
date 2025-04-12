// 외부 라이브러리
import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";

// 내부 모듈
import { LoggerModule } from "../../common/logger/logger.module";

// 상대 경로 import
import { Drone, DroneSchema } from "../database/schemas/drone.schema";
import { DroneController } from "./drone.controller";
import { DroneRepository } from "../database/repositories/drone.repository";
import { DroneService } from "./drone.service";

/**
 * 드론 모듈
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drone.name, schema: DroneSchema }]),
    EventEmitterModule.forRoot(),
    LoggerModule,
  ],
  controllers: [DroneController],
  providers: [DroneService, DroneRepository],
  exports: [DroneService, DroneRepository],
})
export class DroneModule {}
