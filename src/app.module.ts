import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ProfileModule } from './profile/profile.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    CollectionModule,
    UserModule,
    ProfileModule,
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
