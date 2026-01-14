import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from "./config/config.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  app.enableCors()
  app.setGlobalPrefix("api")
  await app.listen(configService.port)
  console.log(`[v0] Event Service running on http://localhost:${configService.port}`)
}
bootstrap()
