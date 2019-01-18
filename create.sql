use website;

insert into users (username, email, password, admin, description, telephone, profilepic) VALUES
  ('mingren', 'chenmr9769@gmail.com', '123123123', True, 'hahahahahha this is me', '6478780510', 'http://5b0988e595225.cdn.sohucs.com/images/20180102/11457172ebd44ab0aa51b863b12622ef.jpeg'),
  ('Zemin', 'ha@gmail.com', '123123123', FALSE , 'too young too simple', '6478780510', 'https://ichef.bbci.co.uk/news/ws/660/amz/worldservice/live/assets/images/2015/02/18/150218083440_cn_jiang_zemin_640x360_afp.jpg'),
  ('带带大师兄', 'example@example.com', '$2a$08$lW1528ASEjLSgYxq.Y2E7ehH74MVT/QYG1NFMM4YlE7Q3GkKqwwa2', FALSE , 'why you shout that loud?\nyou see your mama?', '123123123', 'https://pic4.zhimg.com/50/v2-0532c7edf7f857e43a1ae7ba24ca7cd6_qhd.jpg');


INSERT into house (poster, name, location, postcode, long_des, short_des, type, rate )
VALUES (1, 'Bahen Center','40 St George St, Toronto','M5S 2E4',
        'Located In The Heart Of Downtown Toronto. 24 Hour Concierge. Steps To The Lake, Scotiabank Arena, Union Station',
        'One bedroom in Bahen Center, monthly only $999999', 'Condo', 999999);

INSERT into house (poster, name, location, postcode, long_des, short_des, type, rate )
VALUES (2, 'Robarts Library', '130 St George St, Toronto', 'M5S1A5',
        'The John P. Robarts Research Library, commonly referred to as Robarts Library, is the main humanities and social sciences library of the University of Toronto Libraries',
        'penthouse in heart area of DT toronto at 45 charles street', 'house', 0);

INSERT into house (poster, name, location, postcode, long_des, short_des, type, rate )
VALUES (2, '45 Charles Street penthouse', '45 Charles Street', 'M4Y0A2',
        'Located in the Yonge and Bloor neighbourhood, this Toronto condo was completed in 2015 by Edenshaw Homes Ltd. You will find Chaz Yorkville near the intersection of Yonge St & Charles St East in Toronto"s Downtown area. Spread out over 47 stories, suites at Chaz Yorkville range in size from 378 to 3413 sqft. This Toronto condo has 526 condo units and can be found at 45 Charles Street E. Residents of this condo can enjoy amenities like a Gym / Exercise Room, Common Rooftop Deck, Concierge and a Party Room, along with BBQs, Business Centre, Guest Suites, Media Room / Cinema, Meeting / Function Room, Outdoor Patio / Garden, Games / Recreation Room, Sauna, Security Guard, Enter Phone System, Spa and a Yoga Studio. Monthly maintenance fees include Air Conditioning, Common Element Maintenance, Heat, Building Insurance and Water.',
'penthouse in heart area of DT toronto at 45 charles street', 'condo', 3000);

INSERT into picture VALUES
        (1, '/sources/1_Bahen.jpg'),(2, '/sources/2_robarts.jpg'), (3, '/sources/45charles.jpg')