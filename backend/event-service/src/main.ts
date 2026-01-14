import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix("api")
  await app.listen(3001)
  console.log("[v0] Event Service running on http://localhost:3001")
}
bootstrap()
