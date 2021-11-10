import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate, BaseEntity } from 'typeorm';
import { CollectionEntity } from '../collection/collection.entity';
import { UserEntity } from '../user/user.entity';

@Entity('request')
export class RequestEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  body: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToOne(type => UserEntity, user => user.requests)
  author: UserEntity;

  @ManyToOne(type => CollectionEntity, collection => collection.requests)
  collection: CollectionEntity;

  @Column({default: 0})
  favoriteCount: number;
}
