/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `booking_room` (
  `booking_room_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `guest_number` int DEFAULT NULL,
  `other_requirements` varchar(500) DEFAULT NULL,
  `arrival_date` datetime DEFAULT NULL,
  `leaving_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_room_id`),
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `booking_room_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`),
  CONSTRAINT `booking_room_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `star_number` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(255) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `location_img` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `news` (
  `news_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `datePublished` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `author` varchar(100) DEFAULT NULL,
  `views` int DEFAULT NULL,
  `news_category_id` int DEFAULT NULL,
  PRIMARY KEY (`news_id`),
  KEY `news_category_id` (`news_category_id`),
  CONSTRAINT `news_ibfk_1` FOREIGN KEY (`news_category_id`) REFERENCES `news_category` (`news_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `news_category` (
  `news_category_id` int NOT NULL AUTO_INCREMENT,
  `news_category_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`news_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role` (
  `user_id` int NOT NULL,
  `role_name` enum('admin','user') DEFAULT NULL,
  `role_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `session` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `token` varchar(2000) DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT NULL,
  `login_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `logout_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tag` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(100) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `tbl_room_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_room_detail` (
  `room_id` int NOT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `number_of_people` int DEFAULT NULL,
  `bed_room` int DEFAULT NULL,
  `bed` int DEFAULT NULL,
  `bathroom` int DEFAULT NULL,
  `restroom` int DEFAULT NULL,
  `washing_machine` tinyint(1) DEFAULT NULL,
  `flatiron` tinyint(1) DEFAULT NULL,
  `television` tinyint(1) DEFAULT NULL,
  `air_conditional` tinyint(1) DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  `kitchen` tinyint(1) DEFAULT NULL,
  `pool` tinyint(1) DEFAULT NULL,
  `parking` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  CONSTRAINT `tbl_room_detail_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_room_img` (
  `room_img_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `path` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`room_img_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `tbl_room_img_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_room_like` (
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`room_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `tbl_room_like_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `tbl_room_like_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_room_price` (
  `room_id` int NOT NULL,
  `price` int DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `service_fee` int DEFAULT NULL,
  `apply_date` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`),
  CONSTRAINT `tbl_room_price_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_room_tag` (
  `room_tag_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `tag_id` int DEFAULT NULL,
  PRIMARY KEY (`room_tag_id`),
  KEY `room_id` (`room_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `tbl_room_tag_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`),
  CONSTRAINT `tbl_room_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_room_video` (
  `room_video_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `path` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`room_video_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `tbl_room_video_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `tbl_room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `pass_word` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_info` (
  `user_id` int NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `favorites` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `booking_room` (`booking_room_id`, `user_id`, `room_id`, `guest_number`, `other_requirements`, `arrival_date`, `leaving_date`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 2, 'Không có gì thêm', '2023-07-28 00:00:00', '2023-08-04 00:00:00', '2023-07-31 16:21:45', '2023-07-31 17:00:46');
INSERT INTO `booking_room` (`booking_room_id`, `user_id`, `room_id`, `guest_number`, `other_requirements`, `arrival_date`, `leaving_date`, `created_at`, `updated_at`) VALUES
(2, 8, 2, 5, 'Có 5 người lớn và 2 trẻ em, nhờ người khuân vác đồ đạc', '2023-07-29 00:00:00', '2023-08-01 00:00:00', '2023-07-31 16:22:52', NULL);
INSERT INTO `booking_room` (`booking_room_id`, `user_id`, `room_id`, `guest_number`, `other_requirements`, `arrival_date`, `leaving_date`, `created_at`, `updated_at`) VALUES
(3, 7, 2, 7, 'Thuê 5 chiếc xe máy', '2023-07-29 00:00:00', '2023-08-01 00:00:00', '2023-07-31 16:39:05', NULL);
INSERT INTO `booking_room` (`booking_room_id`, `user_id`, `room_id`, `guest_number`, `other_requirements`, `arrival_date`, `leaving_date`, `created_at`, `updated_at`) VALUES
(4, 6, 3, 12, 'Cần thêm 2 cái nệm lớn', '2023-07-29 00:00:00', '2023-08-01 00:00:00', '2023-07-31 16:40:05', NULL),
(5, 5, 4, 2, 'Thêm 1 bữa ăn tối', '2023-07-29 00:00:00', '2023-08-01 00:00:00', '2023-07-31 16:41:29', NULL);

INSERT INTO `comment` (`comment_id`, `user_id`, `room_id`, `content`, `star_number`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 'phòng đẹp, thoáng mát, nên book nhé các bạn', NULL, '2023-07-31 11:39:50', NULL);
INSERT INTO `comment` (`comment_id`, `user_id`, `room_id`, `content`, `star_number`, `created_at`, `updated_at`) VALUES
(2, 8, 1, 'phòng đẹp, thoáng mát, nên book nhé các bạn', 5, '2023-07-31 11:46:25', NULL);
INSERT INTO `comment` (`comment_id`, `user_id`, `room_id`, `content`, `star_number`, `created_at`, `updated_at`) VALUES
(3, 8, 1, 'cũng bình thường', 3, '2023-07-31 11:47:27', NULL);
INSERT INTO `comment` (`comment_id`, `user_id`, `room_id`, `content`, `star_number`, `created_at`, `updated_at`) VALUES
(5, 8, 1, 'được', 0, '2023-07-31 12:02:25', NULL),
(6, 8, 2, 'không thể nói', 4, '2023-07-31 14:45:45', NULL);

INSERT INTO `location` (`location_id`, `location_name`, `province`, `country`, `location_img`) VALUES
(1, 'Đà Lạt', 'Lâm Đồng', 'Việt Nam', '1690532459803_da-lat.jpg');
INSERT INTO `location` (`location_id`, `location_name`, `province`, `country`, `location_img`) VALUES
(2, 'Nha Trang', 'Khánh Hòa', 'Việt Nam', '1690532538725_nha-trang.jpg');
INSERT INTO `location` (`location_id`, `location_name`, `province`, `country`, `location_img`) VALUES
(3, 'Vũng Tàu', 'Bà Rịa - Vũng Tàu', 'Việt Nam', '1690532642295_vung-tau.jpg');
INSERT INTO `location` (`location_id`, `location_name`, `province`, `country`, `location_img`) VALUES
(4, 'Hội An', 'Quảng Nam', 'Việt Nam', '1690532829908_hoi-an.jpg'),
(5, 'Tràng An', 'Ninh Bình', 'Việt Nam', '1690532856155_trang-an.jpg'),
(6, 'Phong Nha', 'Quảng Bình', 'Việt Nam', '1690536378112_phong-nha-ke-bang.jpg');





INSERT INTO `role` (`user_id`, `role_name`, `role_desc`) VALUES
(1, 'user', 'Người dùng được thao tác giới hạn');
INSERT INTO `role` (`user_id`, `role_name`, `role_desc`) VALUES
(2, 'admin', 'Quyền quản trị cao nhất, được thao tác toàn bộ');
INSERT INTO `role` (`user_id`, `role_name`, `role_desc`) VALUES
(3, 'admin', 'Quyền quản trị cao nhất, được thao tác toàn bộ');
INSERT INTO `role` (`user_id`, `role_name`, `role_desc`) VALUES
(4, 'user', 'Người dùng được thao tác giới hạn'),
(5, 'user', 'Người dùng được thao tác giới hạn'),
(6, 'user', 'Người dùng được thao tác giới hạn'),
(7, 'user', 'Người dùng được thao tác giới hạn'),
(8, 'user', 'Người dùng được thao tác giới hạn');

INSERT INTO `session` (`session_id`, `user_id`, `token`, `is_online`, `login_at`, `logout_at`) VALUES
(1, 1, 'expires', 0, '2023-07-28 10:47:41', '2023-07-28 10:52:19');
INSERT INTO `session` (`session_id`, `user_id`, `token`, `is_online`, `login_at`, `logout_at`) VALUES
(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjEsImVtYWlsIjoiaHVuZzEiLCJyb2xlIjp7InVzZXJfaWQiOjEsInJvbGVfbmFtZSI6InVzZXIiLCJyb2xlX2Rlc2MiOiJOZ8aw4budaSBkw7luZyDEkcaw4bujYyB0aGFvIHTDoWMgZ2nhu5tpIGjhuqFuIn19LCJpYXQiOjE2OTA1MTYzMzksImV4cCI6MTY5MzEwODMzOX0.R-Xyl3X7OiE0_t7bls5X30Qk_PpRxtocQMrMjXFdjzk', 1, '2023-07-28 10:52:19', NULL);
INSERT INTO `session` (`session_id`, `user_id`, `token`, `is_online`, `login_at`, `logout_at`) VALUES
(3, 2, 'expires', 0, '2023-07-28 10:54:04', '2023-07-28 14:36:28');
INSERT INTO `session` (`session_id`, `user_id`, `token`, `is_online`, `login_at`, `logout_at`) VALUES
(4, 3, 'expires', 0, '2023-07-28 10:54:10', '2023-08-01 21:29:24'),
(5, 4, 'expires', 0, '2023-07-28 10:54:13', '2023-08-01 22:17:46'),
(6, 5, 'expires', 0, '2023-07-28 10:54:17', '2023-08-02 10:39:30'),
(7, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjIsImVtYWlsIjoiaHVuZzIiLCJyb2xlIjp7InVzZXJfaWQiOjIsInJvbGVfbmFtZSI6ImFkbWluIiwicm9sZV9kZXNjIjoiUXV54buBbiBxdeG6o24gdHLhu4sgY2FvIG5o4bqldCwgxJHGsOG7o2MgdGhhbyB0w6FjIHRvw6BuIGLhu5kifX0sImlhdCI6MTY5MDUyOTc4OCwiZXhwIjoxNjkzMTIxNzg4fQ.__h7kUY59inZqnMAiI1KChYHIKGFvXTnB-K1GRcQe2g', 1, '2023-07-28 14:36:28', NULL),
(8, 6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjYsImVtYWlsIjoiaHVuZzYiLCJyb2xlIjp7InVzZXJfaWQiOjYsInJvbGVfbmFtZSI6InVzZXIiLCJyb2xlX2Rlc2MiOiJOZ8aw4budaSBkw7luZyDEkcaw4bujYyB0aGFvIHTDoWMgZ2nhu5tpIGjhuqFuIn19LCJpYXQiOjE2OTA3NzI5NTUsImV4cCI6MTY5MzM2NDk1NX0.XjTfKrev8MPun6C18hIti-FkjsCrApcK5zMkwvhZTz0', 1, '2023-07-31 10:09:15', NULL),
(9, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjcsImVtYWlsIjoiaHVuZzciLCJyb2xlIjp7InVzZXJfaWQiOjcsInJvbGVfbmFtZSI6InVzZXIiLCJyb2xlX2Rlc2MiOiJOZ8aw4budaSBkw7luZyDEkcaw4bujYyB0aGFvIHTDoWMgZ2nhu5tpIGjhuqFuIn19LCJpYXQiOjE2OTA3NzI5NjIsImV4cCI6MTY5MzM2NDk2Mn0.bmQ03sks7kuLTrGKE1aPwc5QAtXT-Noa3WHRC3wmHho', 1, '2023-07-31 10:09:23', NULL),
(10, 8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjgsImVtYWlsIjoiaHVuZzgiLCJyb2xlIjp7InVzZXJfaWQiOjgsInJvbGVfbmFtZSI6InVzZXIiLCJyb2xlX2Rlc2MiOiJOZ8aw4budaSBkw7luZyDEkcaw4bujYyB0aGFvIHTDoWMgZ2nhu5tpIGjhuqFuIn19LCJpYXQiOjE2OTA3NzI5NjYsImV4cCI6MTY5MzM2NDk2Nn0.Igg88HsNW-9sQh45O2TKL2iRa9MfY9f1tmI5-L3YcOw', 1, '2023-07-31 10:09:27', NULL),
(11, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjMsImVtYWlsIjoiaHVuZzMiLCJyb2xlIjp7InVzZXJfaWQiOjMsInJvbGVfbmFtZSI6ImFkbWluIiwicm9sZV9kZXNjIjoiUXV54buBbiBxdeG6o24gdHLhu4sgY2FvIG5o4bqldCwgxJHGsOG7o2MgdGhhbyB0w6FjIHRvw6BuIGLhu5kifX0sImlhdCI6MTY5MDkwMDE2NCwiZXhwIjoxNjkzNDkyMTY0fQ.IjSO70upbVOAKNRMNs5L-QRV3WDQvtUFRYRMbsMIME0', 1, '2023-08-01 21:29:24', NULL),
(12, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjQsImVtYWlsIjoiaHVuZzQiLCJyb2xlIjp7InVzZXJfaWQiOjQsInJvbGVfbmFtZSI6InVzZXIiLCJyb2xlX2Rlc2MiOiJOZ8aw4budaSBkw7luZyDEkcaw4bujYyB0aGFvIHTDoWMgZ2nhu5tpIGjhuqFuIn19LCJpYXQiOjE2OTA5MDMwNjYsImV4cCI6MTY5MzQ5NTA2Nn0.-ItM-_QeKPPwZD9I7IhYmDOqNN4St45bhrHSMnro3rk', 1, '2023-08-01 22:17:47', NULL),
(13, 5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjUsImVtYWlsIjoiaHVuZzUiLCJyb2xlIjp7InVzZXJfaWQiOjUsInJvbGVfbmFtZSI6InVzZXIiLCJyb2xlX2Rlc2MiOiJOZ8aw4budaSBkw7luZyDEkcaw4bujYyB0aGFvIHTDoWMgZ2nhu5tpIGjhuqFuIn19LCJpYXQiOjE2OTA5NDc1OTMsImV4cCI6MTY5MzUzOTU5M30.b-0qSMznFTwzGLCDqZkkwFm5hvOVK9dgJqj9FUsM0rY', 1, '2023-08-02 10:39:53', NULL);

INSERT INTO `tag` (`tag_id`, `tag_name`) VALUES
(1, 'sang trọng');
INSERT INTO `tag` (`tag_id`, `tag_name`) VALUES
(2, 'quý phái');
INSERT INTO `tag` (`tag_id`, `tag_name`) VALUES
(3, 'lịch sự');
INSERT INTO `tag` (`tag_id`, `tag_name`) VALUES
(4, 'biệt thự nghỉ dưỡng'),
(5, 'thiết kế ấn tượng'),
(6, 'gần gũi thiên nhiên'),
(7, 'chụp ảnh đẹp'),
(8, 'hiện đại'),
(9, 'phòng gia đình'),
(10, 'khách sạn mới'),
(11, 'thương hiệu quốc tế'),
(12, 'kiến trúc bản địa'),
(13, 'phong cách Châu Âu');

INSERT INTO `tbl_room` (`room_id`, `room_name`, `address`, `location_id`) VALUES
(1, 'Hotel Thanh Lịch', '45 Tây Hòa', 1);
INSERT INTO `tbl_room` (`room_id`, `room_name`, `address`, `location_id`) VALUES
(2, 'Nhà nghỉ Thanh Sương', '55 Cộng Hòa', 2);
INSERT INTO `tbl_room` (`room_id`, `room_name`, `address`, `location_id`) VALUES
(3, 'Homestay Thùy Vân', '64 Thùy Vân', 3);
INSERT INTO `tbl_room` (`room_id`, `room_name`, `address`, `location_id`) VALUES
(4, 'Nhà nghỉ Hưng Thịnh', '15 Hoàng Văn thụ, P10', 1),
(5, 'Nhà nghỉ Mây Lang Thang', '86 Nguyễn Huệ, P3', 1),
(6, 'Nhà nghỉ Vạn Phúc', '73 Trường Chinh', 2),
(7, 'Nhà nghỉ An Nhiên', '18 Phạm Văn Đồng', 2),
(8, 'Khách sạn Ánh Sao', '24 Trường Sa', 3),
(9, 'Khách sạn Ngàn Sao', '100 Hiệp Bình', 3),
(10, 'Homestay Bến Nghé', '100 Bến Nghé, P8', 4),
(11, 'Hotel Ban Mai', '97 Trần Hưng Đạo', 5),
(12, 'Hotel Thái Trường Thịnh', '72 Nguyễn Ái Quốc', 6),
(13, 'Nhà nghỉ Quốc Huy', '40 Đinh Tiên Hoàng', 6),
(14, 'Homestay Lạc Trôi', '25 Võ Thị Sáu', 5);

INSERT INTO `tbl_room_detail` (`room_id`, `content`, `number_of_people`, `bed_room`, `bed`, `bathroom`, `restroom`, `washing_machine`, `flatiron`, `television`, `air_conditional`, `wifi`, `kitchen`, `pool`, `parking`) VALUES
(1, 'Nội dung phòng 1', 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
INSERT INTO `tbl_room_detail` (`room_id`, `content`, `number_of_people`, `bed_room`, `bed`, `bathroom`, `restroom`, `washing_machine`, `flatiron`, `television`, `air_conditional`, `wifi`, `kitchen`, `pool`, `parking`) VALUES
(2, 'Nội dung phòng 2', 5, 2, 2, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1);
INSERT INTO `tbl_room_detail` (`room_id`, `content`, `number_of_people`, `bed_room`, `bed`, `bathroom`, `restroom`, `washing_machine`, `flatiron`, `television`, `air_conditional`, `wifi`, `kitchen`, `pool`, `parking`) VALUES
(3, 'Nội dung phòng 3', 4, 2, 2, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1);
INSERT INTO `tbl_room_detail` (`room_id`, `content`, `number_of_people`, `bed_room`, `bed`, `bathroom`, `restroom`, `washing_machine`, `flatiron`, `television`, `air_conditional`, `wifi`, `kitchen`, `pool`, `parking`) VALUES
(4, 'Nội dung phòng 4', 3, 1, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1),
(5, 'Nội dung phòng 5', 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1),
(6, 'Nội dung phòng 6', 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1),
(7, 'Nội dung phòng 7', 5, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 1),
(8, 'Nội dung phòng 8', 6, 2, 3, 2, 2, 0, 0, 1, 1, 1, 0, 1, 1),
(9, 'Nội dung phòng 9', 4, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1),
(10, 'Nội dung phòng 10', 3, 2, 2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1),
(11, 'Nội dung phòng 11', 4, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1),
(12, 'Nội dung phòng 12', 8, 3, 4, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1),
(13, 'Nội dung phòng 13', 3, 2, 1, 2, 2, 1, 0, 1, 1, 1, 1, 0, 1),
(14, 'Nội dung phòng 14', 4, 2, 2, 1, 2, 1, 0, 1, 0, 1, 1, 1, 1);

INSERT INTO `tbl_room_img` (`room_img_id`, `room_id`, `image_name`, `path`) VALUES
(1, 10, 'p1.jpg', '1690600009476_p1.jpg');
INSERT INTO `tbl_room_img` (`room_img_id`, `room_id`, `image_name`, `path`) VALUES
(2, 10, 'p2.jpg', '1690600009478_p2.jpg');
INSERT INTO `tbl_room_img` (`room_img_id`, `room_id`, `image_name`, `path`) VALUES
(3, 10, 'p3.jpg', '1690600009479_p3.jpg');
INSERT INTO `tbl_room_img` (`room_img_id`, `room_id`, `image_name`, `path`) VALUES
(4, 1, 'p1.jpg', '1690773376135_p1.jpg'),
(5, 1, 'p2.jpg', '1690773376138_p2.jpg'),
(6, 2, 'p3.jpg', '1690773395368_p3.jpg'),
(7, 2, 'p4.jpg', '1690773395370_p4.jpg'),
(8, 3, 'p5.jpg', '1690773430736_p5.jpg'),
(9, 3, 'p6.jpg', '1690773430737_p6.jpg'),
(10, 4, 'p8.jpg', '1690773447513_p8.jpg'),
(11, 4, 'p9.jpg', '1690773447516_p9.jpg'),
(12, 5, 'p5.jpg', '1690773458040_p5.jpg'),
(13, 6, 'p6.jpg', '1690773465797_p6.jpg'),
(14, 7, 'p10.jpg', '1690773476855_p10.jpg'),
(15, 7, 'p11.jpg', '1690773499189_p11.jpg'),
(16, 8, 'p12.jpg', '1690773507225_p12.jpg'),
(17, 8, 'p4.jpg', '1690773514935_p4.jpg'),
(18, 8, 'p5.jpg', '1690773514936_p5.jpg'),
(19, 9, 'p1.jpg', '1690773536630_p1.jpg'),
(20, 9, 'p2.jpg', '1690773536632_p2.jpg'),
(21, 11, 'p5.jpg', '1690773591688_p5.jpg'),
(22, 11, 'p6.jpg', '1690773591689_p6.jpg'),
(23, 12, 'p8.jpg', '1690773605649_p8.jpg'),
(24, 12, 'p9.jpg', '1690773605653_p9.jpg');

INSERT INTO `tbl_room_like` (`user_id`, `room_id`) VALUES
(4, 1);
INSERT INTO `tbl_room_like` (`user_id`, `room_id`) VALUES
(5, 1);
INSERT INTO `tbl_room_like` (`user_id`, `room_id`) VALUES
(7, 1);
INSERT INTO `tbl_room_like` (`user_id`, `room_id`) VALUES
(4, 2),
(5, 2),
(7, 2),
(4, 3),
(5, 3),
(7, 3),
(4, 4),
(5, 4),
(7, 4),
(4, 5),
(5, 5),
(6, 5),
(7, 5),
(8, 5),
(5, 6),
(6, 6),
(7, 6),
(8, 6),
(5, 7),
(6, 7),
(7, 7),
(8, 7),
(5, 8),
(6, 8),
(7, 8),
(5, 9),
(7, 9),
(5, 10),
(7, 10),
(8, 10),
(5, 11),
(7, 11),
(8, 11),
(5, 12),
(7, 12),
(8, 12),
(5, 13);

INSERT INTO `tbl_room_price` (`room_id`, `price`, `discount`, `service_fee`, `apply_date`, `updated_at`) VALUES
(1, 600, 10, 20, '2023-07-29 00:00:00', '2023-07-31 11:01:05');
INSERT INTO `tbl_room_price` (`room_id`, `price`, `discount`, `service_fee`, `apply_date`, `updated_at`) VALUES
(2, 650, 10, 20, '2023-07-29 00:00:00', '2023-07-31 11:01:21');
INSERT INTO `tbl_room_price` (`room_id`, `price`, `discount`, `service_fee`, `apply_date`, `updated_at`) VALUES
(3, 700, 5, 10, '2023-07-29 00:00:00', '2023-07-31 11:02:15');
INSERT INTO `tbl_room_price` (`room_id`, `price`, `discount`, `service_fee`, `apply_date`, `updated_at`) VALUES
(4, 500, 5, 10, '2023-07-29 00:00:00', '2023-07-31 11:02:23'),
(5, 900, 5, 10, '2023-07-29 00:00:00', '2023-07-31 11:02:31'),
(6, 300, 5, 10, '2023-07-29 00:00:00', '2023-07-31 11:02:39'),
(7, 450, 5, 10, '2023-07-29 00:00:00', '2023-07-31 11:02:52'),
(8, 800, 15, 20, '2023-07-29 00:00:00', '2023-08-03 21:03:34'),
(9, 850, 10, 10, '2023-07-29 00:00:00', '2023-08-03 21:05:01'),
(10, 550, 20, 15, '2023-07-29 00:00:00', '2023-08-03 21:05:01'),
(11, 650, 10, 10, '2023-07-29 00:00:00', '2023-08-03 21:05:01'),
(12, 1200, 15, 30, '2023-07-29 00:00:00', '2023-08-03 21:05:01'),
(13, 1400, 0, 50, '2023-07-29 00:00:00', '2023-08-03 21:05:01'),
(14, 1500, 0, 60, '2023-07-29 00:00:00', '2023-08-03 21:05:01');

INSERT INTO `tbl_room_tag` (`room_tag_id`, `room_id`, `tag_id`) VALUES
(1, 1, 1);
INSERT INTO `tbl_room_tag` (`room_tag_id`, `room_id`, `tag_id`) VALUES
(2, 1, 2);
INSERT INTO `tbl_room_tag` (`room_tag_id`, `room_id`, `tag_id`) VALUES
(3, 2, 3);
INSERT INTO `tbl_room_tag` (`room_tag_id`, `room_id`, `tag_id`) VALUES
(4, 2, 4),
(5, 3, 5);

INSERT INTO `tbl_room_video` (`room_video_id`, `room_id`, `path`) VALUES
(1, 12, 'https://www.youtube.com/watch?v=vM4dKOIrkbo');
INSERT INTO `tbl_room_video` (`room_video_id`, `room_id`, `path`) VALUES
(2, 1, 'https://www.youtube.com/watch?v=vM4dKOIrkbo');
INSERT INTO `tbl_room_video` (`room_video_id`, `room_id`, `path`) VALUES
(3, 2, 'https://www.youtube.com/watch?v=vM4dKOIrkbo');
INSERT INTO `tbl_room_video` (`room_video_id`, `room_id`, `path`) VALUES
(4, 3, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(5, 4, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(6, 5, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(7, 6, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(8, 7, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(9, 8, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(10, 9, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(11, 10, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(12, 11, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(13, 12, 'https://www.youtube.com/watch?v=vM4dKOIrkbo'),
(14, 13, 'https://www.youtube.com/watch?v=vM4dKOIrkbo');

INSERT INTO `user` (`user_id`, `email`, `pass_word`, `avatar`) VALUES
(1, 'hung1', '$2b$10$mTaXFTL01CjwXwCg6YfbQ.fG9kXtjMxi4Tms/E4b1vy4St5a8jvAa', '1690900209235_vuong-so-nhien.jpg');
INSERT INTO `user` (`user_id`, `email`, `pass_word`, `avatar`) VALUES
(2, 'hung2', '$2b$10$Ea0edux2J8nDuwUwcdNAu.6xw2Bk389mve7DMFaMNTvqA4aGS.plS', '/public/default/default-avatar.png');
INSERT INTO `user` (`user_id`, `email`, `pass_word`, `avatar`) VALUES
(3, 'hung3', '$2b$10$9oiN.m3.bTa3igRGPMjD1e5tRAMktgMzc46CyT4DvOVmvJs4gahrG', '/public/default/default-avatar.png');
INSERT INTO `user` (`user_id`, `email`, `pass_word`, `avatar`) VALUES
(4, 'hung4', '$2b$10$oCEQVVoXSazBzwM7CjgWt.S/7DT9hTZcpOsbVou3BpoqZi7cmNGFq', '/public/default/default-avatar.png'),
(5, 'hung5', '$2b$10$f2OHJRWW7BVvY27871tHpeHVi2CoqtfdR2Fn28m.oYWqtNrqZLfNy', '1690528724339_duong-duong.jpg'),
(6, 'hung6', '$2b$10$wb6lt.8runNMcIpxLI7ia.3b5PEntLCc/X/IBYPvFmfUBO1QhurGy', '/public/default/default-avatar.png'),
(7, 'hung7', '$2b$10$mMQ7DbtUj6gwspwoc2C7YuRR6BqRpGM2guSdE0KRkIZX014yUxBry', '/public/default/default-avatar.png'),
(8, 'hung8', '$2b$10$TRPCYtuIbjDKch6UQO8j.OpW4bSbTh8g0Pt0bLuyq7kB5VNxozCk6', '/public/default/default-avatar.png');

INSERT INTO `user_info` (`user_id`, `full_name`, `phone`, `age`, `gender`, `country`, `favorites`) VALUES
(1, 'binh', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` (`user_id`, `full_name`, `phone`, `age`, `gender`, `country`, `favorites`) VALUES
(2, 'an', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` (`user_id`, `full_name`, `phone`, `age`, `gender`, `country`, `favorites`) VALUES
(3, 'hung', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` (`user_id`, `full_name`, `phone`, `age`, `gender`, `country`, `favorites`) VALUES
(4, 'viet', NULL, NULL, NULL, NULL, NULL),
(5, 'hung tran', '0123456789', 20, 'male', 'viet nam', 'đá bóng'),
(6, 'thuan', NULL, NULL, NULL, NULL, NULL),
(7, 'đạt', NULL, NULL, NULL, NULL, NULL),
(8, 'hoài', NULL, NULL, NULL, NULL, NULL);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;