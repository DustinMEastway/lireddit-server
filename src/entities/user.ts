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
export class User extends BaseEntity {
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  password!: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ unique: true })
  username!: string;
}
