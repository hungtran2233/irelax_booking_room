import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
    prisma = new PrismaClient();
    async getHello() {
        const test = await this.prisma.tbl_test.findMany({});
        return test;
    }
}
