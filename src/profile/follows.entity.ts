import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity('follows')
export class FollowsEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

}
