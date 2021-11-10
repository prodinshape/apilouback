import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from './collection.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { CollectionService } from './collection.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionEntity, UserEntity, FollowsEntity]), UserModule],
  providers: [CollectionService],
  controllers: [
    CollectionController
  ]
})
export class CollectionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'collections/feed', method: RequestMethod.GET},
        {path: 'collections', method: RequestMethod.POST},
        {path: 'collections/:slug', method: RequestMethod.DELETE},
        {path: 'collections/:slug', method: RequestMethod.PUT},
        {path: 'collections/:slug/comments', method: RequestMethod.POST},
        {path: 'collections/:slug/comments/:id', method: RequestMethod.DELETE},
        {path: 'collections/:slug/favorite', method: RequestMethod.POST},
        {path: 'collections/:slug/favorite', method: RequestMethod.DELETE});
  }
}
