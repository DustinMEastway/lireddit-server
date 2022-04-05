import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
