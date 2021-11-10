import { ResourceWithOptions } from 'admin-bro';
import { RequestEntity } from '../../request/request.entity';

const UserResource: ResourceWithOptions = {
  resource: RequestEntity,
  options: {},
};

export default UserResource;
