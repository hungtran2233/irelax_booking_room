import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaClient } from '@prisma/client';
import { conflict, notFound, successCode } from 'config/Response';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocationService {
    prisma = new PrismaClient();

    // Tạo location
    async create(
        req: any,
        locationName: string,
        province: string,
        country: string,
        locationImg: Express.Multer.File,
    ) {
        // Kiểm tra tồn tại location
        const existingLocation = await this.prisma.location.findFirst({
            where: {
                location_name: locationName,
            },
        });
        if (existingLocation) conflict('Tên địa điểm đã tồn tại');

        const newLocation = await this.prisma.location.create({
            data: {
                location_name: locationName,
                province: province,
                country: country,
                location_img: locationImg.filename,
            },
        });

        return successCode(201, 'Tạo mới địa điểm thành công', newLocation);
    }

    // Lấy tất cả địa điểm
    async findAll() {
        const allLocation = await this.prisma.location.findMany({});
        return successCode(200, 'Lấy tất cả địa điểm thành công', allLocation);
    }

    // Lấy 1 địa điểm
    async findOne(id: number) {
        const location = await this.prisma.location.findFirst({
            where: {
                location_id: id,
            },
        });
        return successCode(200, 'Lấy địa điểm thành công', location);
    }

    // Chỉnh sửa địa điểm
    async update(
        req: any,
        id: number,
        locationName: string,
        province: string,
        country: string,
        locationImg: Express.Multer.File,
    ) {
        const existingLocation = await this.prisma.location.findFirst({
            where: {
                location_id: id,
            },
        });

        if (!existingLocation) notFound('Địa điểm này không tồn tại');

        // -- Xóa ảnh cũ trên server
        if (existingLocation.location_img) {
            // Nếu có ảnh mới được upload lên thì mới tiến hành xóa ảnh cũ, nếu ko thì khỏi xóa
            if (locationImg) {
                // Lấy đường dẫn ảnh (cũ) trên server
                const oldImagePath = path.join(
                    process.cwd(),
                    'public/img-location',
                    existingLocation.location_img,
                );
                // Kiểm tra xem ảnh cũ có tồn tại trên server không
                if (fs.existsSync(oldImagePath)) {
                    // Nếu tồn tại, thực hiện xóa ảnh
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Cập nhật lại location
        let newLocation;
        if (locationImg) {
            newLocation = await this.prisma.location.update({
                where: {
                    location_id: id,
                },
                data: {
                    location_name: locationName,
                    province: province,
                    country: country,
                    location_img: locationImg.filename,
                },
            });
        } else {
            newLocation = await this.prisma.location.update({
                where: {
                    location_id: id,
                },
                data: {
                    location_name: locationName,
                    province: province,
                    country: country,
                },
            });
        }

        return successCode(200, 'Cập nhật địa điểm thành công', newLocation);
    }

    // Xóa địa điểm
    async remove(id: number) {
        await this.prisma.location.delete({
            where: {
                location_id: id,
            },
        });
        return successCode(
            200,
            'Xóa địa điểm thành công',
            `Remove LocationID=${id}`,
        );
    }
}
