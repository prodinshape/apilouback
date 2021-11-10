import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany, BaseEntity} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';

import { CollectionEntity } from '../collection/collection.entity';
import { RequestEntity } from '../request/request.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  password: string;

  @Column('simple-array', {nullable: true})
  tagList: string[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }


  @OneToMany(type => CollectionEntity, collection => collection.author)
  collections: CollectionEntity[];

  @OneToMany(type => RequestEntity, request => request.author)
  requests: RequestEntity[];

}
