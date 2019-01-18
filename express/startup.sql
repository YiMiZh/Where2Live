drop DATABASE IF EXISTS website;
create DATABASE website;
use website;
drop TABLE IF EXISTS users, house, posting, picture;

CREATE TABLE users(
  id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  username VARCHAR(30) NOT NULL ,
  email VARCHAR(30) NOT NULL UNIQUE ,
  password VARCHAR(128) NOT NULL ,
  admin BOOL NOT NULL,
  description VARCHAR(400),
  telephone VARCHAR(13),
  profilepic VARCHAR(1000)
);



create table house(
  id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  poster MEDIUMINT REFERENCES users(id),
  name VARCHAR(100) not NULL ,
  location VARCHAR(100) NOT NULL ,
  postcode VARCHAR(7) not NULL ,
  long_des VARCHAR(10000),
  short_des VARCHAR(300),
  type ENUM('condo', 'house'),
  rate int
);

create table picture(
  house_id MEDIUMINT REFERENCES house(id),
  url VARCHAR(1000),
  UNIQUE (house_id, url)
);

create table contacts(
  user_id MEDIUMINT REFERENCES users(id),
  contact VARCHAR(100),
  UNIQUE (user_id, contact)
);
