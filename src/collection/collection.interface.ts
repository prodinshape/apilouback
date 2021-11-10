import { UserData } from '../user/user.interface';
import { CollectionEntity } from './collection.entity';
interface Comment {
  body: string;
}

interface CollectionData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  createdAt?: Date
  updatedAt?: Date
  favorited?: boolean;
  favoritesCount?: number;
  author?: UserData;
}

export interface CollectionRO {
  collection: CollectionEntity;
}

export interface CollectionsRO {
  collections: CollectionEntity[];
  collectionsCount: number;
}
