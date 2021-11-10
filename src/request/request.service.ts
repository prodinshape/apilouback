import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { RequestEntity } from './request.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { CreateRequestDto } from './dto';

import {RequestRO, RequestsRO} from './request.interface';
const slug = require('slug');

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  async findAll(query): Promise<RequestsRO> {

    const qb = await getRepository(RequestEntity)
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.author', 'author');

    qb.where("1 = 1");

    if ('tag' in query) {
      qb.andWhere("request.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({username: query.author});
      qb.andWhere("request.authorId = :id", { id: author.id });
    }

    qb.orderBy('request.created', 'DESC');

    const requestsCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const requests = await qb.getMany();

    return {requests, requestsCount};
  }

  async findFeed(userId: number, query): Promise<RequestsRO> {
    const _follows = await this.followsRepository.find( {followerId: userId});

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return {requests: [], requestsCount: 0};
    }

    const ids = _follows.map(el => el.followingId);

    const qb = await getRepository(RequestEntity)
      .createQueryBuilder('request')
      .where('request.authorId IN (:ids)', { ids });

    qb.orderBy('request.created', 'DESC');

    const requestsCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const requests = await qb.getMany();

    return {requests, requestsCount};
  }

  async findOne(where): Promise<RequestRO> {
    const request = await this.requestRepository.findOne(where);
    return {request};
  }

  // async favorite(id: number, slug: string): Promise<RequestRO> {
  //   let request = await this.requestRepository.findOne({slug});
  //   const user = await this.userRepository.findOne(id);

  //   const isNewFavorite = user.favorites.findIndex(_request => _request.id === request.id) < 0;
  //   if (isNewFavorite) {
  //     user.favorites.push(request);
  //     request.favoriteCount++;

  //     await this.userRepository.save(user);
  //     request = await this.requestRepository.save(request);
  //   }

  //   return {request};
  // }

  // async unFavorite(id: number, slug: string): Promise<RequestRO> {
  //   let request = await this.requestRepository.findOne({slug});
  //   const user = await this.userRepository.findOne(id);

  //   const deleteIndex = user.favorites.findIndex(_request => _request.id === request.id);

  //   if (deleteIndex >= 0) {

  //     user.favorites.splice(deleteIndex, 1);
  //     request.favoriteCount--;

  //     await this.userRepository.save(user);
  //     request = await this.requestRepository.save(request);
  //   }

  //   return {request};
  // }

  async create(userId: number, requestData: CreateRequestDto): Promise<RequestEntity> {

    let request = new RequestEntity();
    console.log(requestData)
    request.title = requestData.title;
    request.description = requestData.description;
    request.slug = this.slugify(requestData.title);
    request.tagList = requestData.tagList || [];

    const newRequest = await this.requestRepository.save(request);

    const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['requests'] });
    author.requests.push(request);

    await this.userRepository.save(author);

    return newRequest;

  }

  async update(slug: string, requestData: any): Promise<RequestRO> {
    let toUpdate = await this.requestRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, requestData);
    const request = await this.requestRepository.save(updated);
    return {request};
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.requestRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
