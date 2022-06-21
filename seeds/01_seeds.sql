INSERT INTO users ( name, email, password) 
    VALUES 
    ('Brandon Gervais', 'bdg@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
    ('Marianne Bourcier', 'mb@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
    ('Nolan Gervais', 'dog@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO properties (owner_id, title , description , thumbnail_photo_url , cover_photo_url , cost_per_night , parking_spaces , number_of_bathrooms , number_of_bedrooms , country , street , city , province , post_code , active)
VALUES
(1, 'Speed lamp' ,'description' , 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350' , 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 93061, 3, 5, 3, 'Canada', '536 Namsub Highway', 'Sotboske', 'Quebec', 28142, TRUE),
(2, 'Blank corner', 'description' , 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350' , 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 40000, 3, 5, 3, 'Canada', '651 Nami Road     ', 'Bohbatev', 'Alberta', 83680, TRUE),
(3, 'Habit mix', 'description' , 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350' , 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg' , 120000, 3, 5, 3, 'Canada', '1650 Hejto Center ', 'Genwezuj', 'Newfoundland And Labrador', 44583, TRUE);

INSERT INTO reservations (start_date,  end_date , property_id, guest_id)
VALUES 
('2018-09-11', '2018-09-26', 2, 3),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 1, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES 
(2, 3, 3, 3, 'messages'),
(3, 2, 2, 2, 'messages'),
(1, 1, 1, 2, 'messages');