import { ResourceWithOptions } from 'admin-bro';
import { UserEntity } from '../../user/user.entity';

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: {},
};

export default UserResource;
