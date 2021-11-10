import { UserData } from '../user/user.interface';
import { RequestEntity } from './request.entity';
interface Comment {
  body: string;
}

interface RequestData {
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

export interface RequestRO {
  request: RequestEntity;
}

export interface RequestsRO {
  requests: RequestEntity[];
  requestsCount: number;
}
