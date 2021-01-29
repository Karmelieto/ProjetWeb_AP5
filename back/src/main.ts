import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  await app.listen(4242);
  console.log("** Toppics back server running at localhost:4242 **");
}
bootstrap();
