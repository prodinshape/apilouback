import { ResourceWithOptions } from 'admin-bro';
import { FollowsEntity } from '../../profile/follows.entity';

const UserResource: ResourceWithOptions = {
  resource: FollowsEntity,
  options: {},
};

export default UserResource;
