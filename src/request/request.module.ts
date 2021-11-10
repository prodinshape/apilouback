import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from './request.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { RequestService } from './request.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, UserEntity, FollowsEntity]), UserModule],
  providers: [RequestService],
  controllers: [
    RequestController
  ]
})
export class RequestModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'requests/feed', method: RequestMethod.GET},
        {path: 'requests', method: RequestMethod.POST},
        {path: 'requests/:slug', method: RequestMethod.DELETE},
        {path: 'requests/:slug', method: RequestMethod.PUT},
        {path: 'requests/:slug/comments', method: RequestMethod.POST},
        {path: 'requests/:slug/comments/:id', method: RequestMethod.DELETE},
        {path: 'requests/:slug/favorite', method: RequestMethod.POST},
        {path: 'requests/:slug/favorite', method: RequestMethod.DELETE});
  }
}
