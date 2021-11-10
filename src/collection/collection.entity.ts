import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate, BaseEntity, ManyToMany } from 'typeorm';
import { RequestEntity } from '../request/request.entity';
import { UserEntity } from '../user/user.entity';

@Entity('collection')
export class CollectionEntity extends BaseEntity {

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

  @ManyToOne(type => UserEntity, user => user.collections)
  author: UserEntity;

  @OneToMany(type => RequestEntity, request => request.collection)
  requests: RequestEntity[];

  @Column({default: 0})
  favoriteCount: number;
}
