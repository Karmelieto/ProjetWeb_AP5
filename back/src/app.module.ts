import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { PublicationsModule } from './publications/publications.module'
import { TagsModule } from './tags/tags.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://' +
        process.env.DATABASE_USER +
        ':' +
        process.env.DATABASE_PASSWORD +
        '@cluster0.sbi0m.mongodb.net/toppics?retryWrites=true&w=majority',
      { useFindAndModify: false }
    ),
    UsersModule,
    PublicationsModule,
    TagsModule
  ]
})
export class AppModule {}
