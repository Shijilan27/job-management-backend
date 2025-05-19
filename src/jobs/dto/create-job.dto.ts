import { IsString, IsEnum, IsNumber, IsDate, Min, IsNotEmpty, MaxLength, MinLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { JobType, JobStatus } from '../entities/job.entity';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  @MinLength(3, { message: 'Job title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Job title cannot exceed 100 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  @MinLength(2, { message: 'Company name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Company name cannot exceed 100 characters' })
  company: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  @MaxLength(100, { message: 'Location cannot exceed 100 characters' })
  location: string;

  @IsEnum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'], {
    message: 'Job type must be one of: Full-time, Part-time, Contract, Internship, Freelance'
  })
  type: JobType;

  @IsNumber()
  @Min(0, { message: 'Minimum salary must be a positive number' })
  salaryMin: number;

  @IsNumber()
  @Min(0, { message: 'Maximum salary must be a positive number' })
  salaryMax: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Application deadline is required' })
  applicationDeadline: Date;

  @IsString()
  @IsNotEmpty({ message: 'Job description is required' })
  @MinLength(50, { message: 'Job description must be at least 50 characters long' })
  @MaxLength(5000, { message: 'Job description cannot exceed 5000 characters' })
  description: string;

  @IsEnum(['draft', 'published', 'closed'], {
    message: 'Status must be one of: draft, published, closed'
  })
  @IsOptional()
  status: JobStatus = 'draft';

  @IsOptional()
  @IsString()
  companyLogo?: string;
} 