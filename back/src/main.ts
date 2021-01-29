import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("** Toppics back server running at localhost:3000 **");
}
bootstrap();
