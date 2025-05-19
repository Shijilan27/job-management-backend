import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    try {
      console.log('Creating job with data:', createJobDto);
      console.log('Company logo:', createJobDto.companyLogo);

      // Validate salary range
      if (createJobDto.salaryMax < createJobDto.salaryMin) {
        throw new BadRequestException('Maximum salary must be greater than minimum salary');
      }

      // Validate application deadline
      if (createJobDto.applicationDeadline < new Date()) {
        throw new BadRequestException('Application deadline must be in the future');
      }

      const job = this.jobsRepository.create(createJobDto);
      console.log('Created job entity:', job);

      const savedJob = await this.jobsRepository.save(job);
      console.log('Saved job:', savedJob);

      return savedJob;
    } catch (error) {
      console.error('Error creating job:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create job posting');
    }
  }

  async findAll(): Promise<Job[]> {
    try {
      console.log('Fetching all jobs');
      const jobs = await this.jobsRepository.find();
      console.log(`Found ${jobs.length} jobs`);
      return jobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new InternalServerErrorException('Failed to fetch jobs');
    }
  }

  async findOne(id: string): Promise<Job> {
    try {
      console.log('Fetching job with ID:', id);
      const job = await this.jobsRepository.findOneBy({ id });
      if (!job) {
        console.log('Job not found:', id);
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
      console.log('Found job:', job);
      return job;
    } catch (error) {
      console.error('Error fetching job:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch job');
    }
  }

  async update(id: string, updateJobDto: Partial<CreateJobDto>): Promise<Job> {
    try {
      console.log('Updating job with ID:', id, 'Data:', updateJobDto);
      
      // Check if job exists
      const existingJob = await this.findOne(id);

      // Validate salary range if both are provided
      if (updateJobDto.salaryMin !== undefined && updateJobDto.salaryMax !== undefined) {
        if (updateJobDto.salaryMax < updateJobDto.salaryMin) {
          throw new BadRequestException('Maximum salary must be greater than minimum salary');
        }
      }

      // Validate application deadline if provided
      if (updateJobDto.applicationDeadline && updateJobDto.applicationDeadline < new Date()) {
        throw new BadRequestException('Application deadline must be in the future');
      }

      await this.jobsRepository.update(id, updateJobDto);
      const updatedJob = await this.findOne(id);
      console.log('Updated job:', updatedJob);
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update job');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      console.log('Deleting job with ID:', id);
      // Check if job exists
      await this.findOne(id);
      await this.jobsRepository.delete(id);
      console.log('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete job');
    }
  }
} 