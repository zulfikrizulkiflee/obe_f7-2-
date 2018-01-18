-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.20-log - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table arubait.book
CREATE TABLE IF NOT EXISTS `book` (
  `book_id` int(11) NOT NULL AUTO_INCREMENT,
  `book_status` varchar(10) DEFAULT '0' COMMENT 'NEW,APPLIED',
  `job_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table arubait.book: ~0 rows (approximately)
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
/*!40000 ALTER TABLE `book` ENABLE KEYS */;

-- Dumping structure for table arubait.follow
CREATE TABLE IF NOT EXISTS `follow` (
  `follow_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `employer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`follow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table arubait.follow: ~0 rows (approximately)
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;

-- Dumping structure for table arubait.job_applied
CREATE TABLE IF NOT EXISTS `job_applied` (
  `applied_id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`applied_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table arubait.job_applied: ~0 rows (approximately)
/*!40000 ALTER TABLE `job_applied` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_applied` ENABLE KEYS */;

-- Dumping structure for table arubait.job_category
CREATE TABLE IF NOT EXISTS `job_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_desc` varchar(100) DEFAULT NULL,
  `category_picture` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table arubait.job_category: ~2 rows (approximately)
/*!40000 ALTER TABLE `job_category` DISABLE KEYS */;
INSERT INTO `job_category` (`category_id`, `category_desc`, `category_picture`) VALUES
	(1, 'Food & Beverage', 'http://www.ngrguardiannews.com/wp-content/uploads/2015/03/Fast-food.jpg'),
	(2, 'Cleaning', 'http://www.bondcleanaustralia.com.au/media/779607/Home-Cleaning-Gold-Coast.jpg');
/*!40000 ALTER TABLE `job_category` ENABLE KEYS */;

-- Dumping structure for table arubait.job_offered
CREATE TABLE IF NOT EXISTS `job_offered` (
  `job_id` int(11) NOT NULL AUTO_INCREMENT,
  `job_date_post` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `job_date_work` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `job_status` varchar(10) NOT NULL DEFAULT '0' COMMENT 'NEW,APPLIED,ACCEPTED,REJECTED,COMPLETED,CANCELED',
  `category_id` int(11) NOT NULL DEFAULT '0',
  `job_description` varchar(500) NOT NULL DEFAULT '0',
  `job_poskod` int(11) NOT NULL DEFAULT '0',
  `job_address` varchar(500) NOT NULL DEFAULT '0',
  `job_salary` varchar(50) NOT NULL DEFAULT '0',
  `employer_rating` int(11) NOT NULL DEFAULT '0',
  `employer_review` varchar(500) NOT NULL DEFAULT '0',
  `employee_rating` int(11) NOT NULL DEFAULT '0',
  `employee_review` varchar(500) NOT NULL DEFAULT '0',
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table arubait.job_offered: ~0 rows (approximately)
/*!40000 ALTER TABLE `job_offered` DISABLE KEYS */;
INSERT INTO `job_offered` (`job_id`, `job_date_post`, `job_date_work`, `job_status`, `category_id`, `job_description`, `job_poskod`, `job_address`, `job_salary`, `employer_rating`, `employer_review`, `employee_rating`, `employee_review`) VALUES
	(1, '0000-00-00 00:00:00', '2017-10-10 02:10:10', 'NEW', 1, 'Tukang Masak', 27000, 'Taman Inderapura', '500.50', 3, 'good', 3, 'good'),
	(2, '0000-00-00 00:00:00', '2016-12-25 05:00:00', 'NEW', 1, 'Tukang Buat Air', 27000, 'Taman Inderapura', '100', 3, 'good', 3, 'good'),
	(3, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'NEW', 2, 'Kemas Rumah', 27000, 'Taman Inderapura', '100', 3, 'good', 3, 'good'),
	(4, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'NEW', 2, 'Potong Rumput', 27000, 'Taman Inderapura', '100', 3, 'good', 3, 'good');
/*!40000 ALTER TABLE `job_offered` ENABLE KEYS */;

-- Dumping structure for table arubait.notification
CREATE TABLE IF NOT EXISTS `notification` (
  `noti_id` int(11) NOT NULL AUTO_INCREMENT,
  `noti_desc` varchar(500) DEFAULT NULL,
  `noti_target` varchar(100) DEFAULT NULL,
  `noti_status` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`noti_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table arubait.notification: ~0 rows (approximately)
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;

-- Dumping structure for table arubait.user_profile
CREATE TABLE IF NOT EXISTS `user_profile` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) DEFAULT NULL,
  `user_fullname` varchar(100) DEFAULT NULL,
  `user_poskod` int(10) DEFAULT NULL,
  `user_address` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table arubait.user_profile: ~0 rows (approximately)
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_profile` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
