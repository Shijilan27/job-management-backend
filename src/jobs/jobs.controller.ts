import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Multer } from 'multer';

@Controller('jobs')
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('companyLogo', {
      storage: diskStorage({
        destination: './uploads/logos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createJob(
    @UploadedFile() file: Multer.File,
    @Body() body: any,
  ) {
    const logoUrl = file ? `/uploads/logos/${file.filename}` : null;
    const job = await this.jobsService.create({ ...body, companyLogo: logoUrl });
    return job;
  }

  @Get()
  async findAll(): Promise<Job[]> {
    this.logger.log('Fetching all jobs');
    try {
      const jobs = await this.jobsService.findAll();
      this.logger.log(`Successfully fetched ${jobs.length} jobs`);
      return jobs;
    } catch (error) {
      this.logger.error(`Failed to fetch jobs: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Job> {
    this.logger.log(`Fetching job with ID: ${id}`);
    try {
      const job = await this.jobsService.findOne(id);
      this.logger.log(`Successfully fetched job with ID: ${id}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to fetch job ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: Partial<CreateJobDto>,
  ): Promise<Job> {
    this.logger.log(`Updating job ${id} with data: ${JSON.stringify(updateJobDto)}`);
    try {
      const job = await this.jobsService.update(id, updateJobDto);
      this.logger.log(`Successfully updated job with ID: ${id}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to update job ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting job with ID: ${id}`);
    try {
      await this.jobsService.remove(id);
      this.logger.log(`Successfully deleted job with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete job ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 