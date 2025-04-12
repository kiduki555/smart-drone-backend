import { Module } from '@nestjs/common';
import { MavlinkService } from './mavlink.service';
import { MavlinkController } from './mavlink.controller';

@Module({
  providers: [MavlinkService],
  controllers: [MavlinkController]
})
export class MavlinkModule {}
