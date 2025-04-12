import { Module } from "@nestjs/common";
import { DroneController } from "./modules/drone/drone.controller";
import { DroneModule } from "./modules/drone/drone.module";
import { MavlinkModule } from "./modules/mavlink/mavlink.module";
import { ToolModule } from "./modules/tool/tool.module";
import { FireModule } from "./modules/fire/fire.module";
import { McpModule } from "./modules/mcp/mcp.module";
import { DatabaseModule } from "./modules/database/database.module";

@Module({
  imports: [
    DroneModule,
    MavlinkModule,
    RedisModule,
    ToolModule,
    FireModule,
    McpModule,
    DatabaseModule,
  ],
  controllers: [DroneController],
  providers: [],
})
export class AppModule {}
