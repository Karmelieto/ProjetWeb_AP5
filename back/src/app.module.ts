import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { PublicationsModule } from './publications/publications.module'
import { TagsModule } from './tags/tags.module'
import { ImagessModule } from './images/images.module'

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dbAdminUser:MPvsNZdTNNtd8u0K@cluster0.sbi0m.mongodb.net/toppics?retryWrites=true&w=majority'
    ),
    UsersModule,
    PublicationsModule,
    TagsModule,
    ImagessModule
  ]
})
export class AppModule {}
