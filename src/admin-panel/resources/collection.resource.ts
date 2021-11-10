import { ResourceWithOptions } from 'admin-bro';
import { CollectionEntity } from '../../collection/collection.entity';

const UserResource: ResourceWithOptions = {
  resource: CollectionEntity,
  options: {},
};

export default UserResource;
