"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_service_1 = require("./config/config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_service_1.ConfigService);
    app.enableCors();
    app.setGlobalPrefix("api");
    await app.listen(configService.port);
    console.log(`[v0] Event Service running on http://localhost:${configService.port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map