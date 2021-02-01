import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { PublicationsModule } from './publications/publications.module'
import { TagsModule } from './tags/tags.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/toppics'),
    UsersModule,
    PublicationsModule,
    TagsModule
  ]
})
export class AppModule {}
