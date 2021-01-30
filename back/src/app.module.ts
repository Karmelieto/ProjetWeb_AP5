import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './modules/users.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/toppics'),
    UsersModule
  ]
})
export class AppModule {}
