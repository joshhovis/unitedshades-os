import { Injectable, NotFoundException } from '@nestjs/common';
import type { JobPhoto } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { CreateUploadDto } from './dto/create-upload.dto';

@Injectable()
export class PhotosService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  constructor(private prisma: PrismaService) {}

  async createUpload(dto: CreateUploadDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
      select: { id: true },
    });
    if (!job) throw new NotFoundException('Job not found');

    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
      select: { id: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    const bucket = process.env.AWS_S3_BUCKET!;
    const key = `jobs/${dto.jobId}/${Date.now()}-${dto.fileName}`;

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: dto.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, cmd, { expiresIn: 60 });

    const photo = await this.prisma.jobPhoto.create({
      data: {
        jobId: dto.jobId,
        customerId: dto.customerId,
        s3Key: key,
        url: null,
        tags: null,
      },
      select: { id: true },
    });

    return { uploadUrl, key, photoId: photo.id };
  }

  list(jobId: string): Promise<JobPhoto[]> {
    return this.prisma.jobPhoto.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
