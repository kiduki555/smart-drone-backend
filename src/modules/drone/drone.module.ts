import { Module } from '@nestjs/common';
import { DroneService } from './drone.service';

@Module({
  providers: [DroneService]
})
export class DroneModule {}
