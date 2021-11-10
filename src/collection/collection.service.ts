import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { CollectionEntity } from './collection.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { CreateCollectionDto } from './dto';

import {CollectionRO, CollectionsRO} from './collection.interface';
const slug = require('slug');

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  async findAll(query): Promise<CollectionsRO> {

    const qb = await getRepository(CollectionEntity)
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.author', 'author');

    qb.where("1 = 1");

    if ('tag' in query) {
      qb.andWhere("collection.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({username: query.author});
      qb.andWhere("collection.authorId = :id", { id: author.id });
    }

    // if ('favorited' in query) {
    //   const author = await this.userRepository.findOne({username: query.favorited});
    //   const ids = author.favorites.map(el => el.id);
    //   qb.andWhere("collection.authorId IN (:ids)", { ids });
    // }

    qb.orderBy('collection.created', 'DESC');

    const collectionsCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const collections = await qb.getMany();

    return {collections, collectionsCount};
  }

  async findFeed(userId: number, query): Promise<CollectionsRO> {
    const _follows = await this.followsRepository.find( {followerId: userId});

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return {collections: [], collectionsCount: 0};
    }

    const ids = _follows.map(el => el.followingId);

    const qb = await getRepository(CollectionEntity)
      .createQueryBuilder('collection')
      .where('collection.authorId IN (:ids)', { ids });

    qb.orderBy('collection.created', 'DESC');

    const collectionsCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const collections = await qb.getMany();

    return {collections, collectionsCount};
  }

  async findOne(where): Promise<CollectionRO> {
    const collection = await this.collectionRepository.findOne(where);
    return {collection};
  }

  // async favorite(id: number, slug: string): Promise<CollectionRO> {
  //   let collection = await this.collectionRepository.findOne({slug});
  //   const user = await this.userRepository.findOne(id);

  //   const isNewFavorite = user.favorites.findIndex(_collection => _collection.id === collection.id) < 0;
  //   if (isNewFavorite) {
  //     user.favorites.push(collection);
  //     collection.favoriteCount++;

  //     await this.userRepository.save(user);
  //     collection = await this.collectionRepository.save(collection);
  //   }

  //   return {collection};
  // }

  // async unFavorite(id: number, slug: string): Promise<CollectionRO> {
  //   let collection = await this.collectionRepository.findOne({slug});
  //   const user = await this.userRepository.findOne(id);

  //   const deleteIndex = user.favorites.findIndex(_collection => _collection.id === collection.id);

  //   if (deleteIndex >= 0) {

  //     user.favorites.splice(deleteIndex, 1);
  //     collection.favoriteCount--;

  //     await this.userRepository.save(user);
  //     collection = await this.collectionRepository.save(collection);
  //   }

  //   return {collection};
  // }

  async create(userId: number, collectionData: CreateCollectionDto): Promise<CollectionEntity> {

    let collection = new CollectionEntity();
    console.log(collectionData)
    collection.title = collectionData.title;
    collection.description = collectionData.description;
    collection.slug = this.slugify(collectionData.title);
    collection.tagList = collectionData.tagList || [];

    const newCollection = await this.collectionRepository.save(collection);

    const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['collections'] });
    author.collections.push(collection);

    await this.userRepository.save(author);

    return newCollection;

  }

  async update(slug: string, collectionData: any): Promise<CollectionRO> {
    let toUpdate = await this.collectionRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, collectionData);
    const collection = await this.collectionRepository.save(updated);
    return {collection};
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.collectionRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
