import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { config, swaggerPath } from './swagger'
import { AppModule } from './modules/app/app.module'
import * as cookieParser from 'cookie-parser'
import { writeFileSync } from 'fs'

const PORT = process.env.PORT || 5000

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.enableCors({
    credentials: true,
    origin: true,
  })

  app.use(cookieParser())

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(swaggerPath, app, document)
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2))

  await app.listen(PORT)
}

bootstrap()
