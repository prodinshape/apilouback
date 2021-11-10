import { INestApplication } from '@nestjs/common';
import { Database, Resource } from 'admin-bro-typeorm';

import AdminBro from 'admin-bro';

import * as AdminBroExpress from 'admin-bro-expressjs';
import UserResource from './resources/user.resource';
import RequestResource from './resources/request.resource';
import FollowResource from './resources/follow.resource';
import CollectionResource from './resources/collection.resource';


export async function setupAdminPanel(app: INestApplication): Promise<void> {

  AdminBro.registerAdapter({ Database, Resource });

  const adminBro = new AdminBro({
    resources: [UserResource, RequestResource, FollowResource, CollectionResource],
    rootPath: '/admin',
  });

  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);

}
