import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type JobStatus = 'draft' | 'published' | 'closed';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
  })
  type: JobType;

  @Column('decimal')
  salaryMin: number;

  @Column('decimal')
  salaryMax: number;

  @Column({ type: 'timestamp' })
  applicationDeadline: Date;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  })
  status: JobStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  companyLogo: string;
} 