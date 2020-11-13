import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { prismaVersion } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const createUser = await this.prisma.user.create({
      data: {
        email: 'alice@prisma.io',
        name: 'Alice',
      },
      select: {
        id: true,
        name: true,
      },
    });

    const updateUser = await this.prisma.user.update({
      where: {
        id: createUser.id,
      },
      data: {
        email: 'bob@prisma.io',
        name: 'Bob',
      },
      select: {
        name: true,
      },
    });

    const deleteUser = await this.prisma.user.delete({
      where: {
        id: createUser.id,
      },
      select: {
        name: true,
      },
    });

    return JSON.stringify({
      prismaVersion: Prisma.prismaVersion.client,
      createUser: {
        name: createUser.name,
      },
      updateUser,
      deleteUser,
    });
  }
}
