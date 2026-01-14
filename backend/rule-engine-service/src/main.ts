import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix("api")
  await app.listen(3002)
  console.log("[v0] Rule Engine Service running on http://localhost:3002")
}
bootstrap()
