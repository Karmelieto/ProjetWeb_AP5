import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap () {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug']
  })
  const port = 4242;
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Toppics API documentation')
    .setDescription('TOPPICS TEAM')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(port)
  console.log('** Toppics back server running at localhost:%s **', port)
  console.log(
    '** Toppics back swagger running at localhost:%s/swagger **',
    port
  )
}
bootstrap()
