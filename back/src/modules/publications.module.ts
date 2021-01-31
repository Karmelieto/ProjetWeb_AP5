import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Publication, PublicationSchema } from '../schemas/publication.schema'
import { PublicationsController } from '../controllers/publications.controller'
import { PublicationsService } from '../services/publications.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publication.name, schema: PublicationSchema }
    ])
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService],
  exports: [PublicationsService]
})
export class PublicationsModule {}
