/*Tabla Users y Roles*/
CREATE TABLE roles (
	role_id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	role_type VARCHAR(15) UNIQUE NOT NULL,
	role_state BOOLEAN NOT NULL
);
CREATE TABLE users (
	user_id TEXT UNIQUE PRIMARY KEY NOT NULL,
	u_name VARCHAR(40) NOT NULL,
	u_last_name VARCHAR(40) NOT NULL,
	u_email TEXT NOT NULL,
	u_password TEXT NOT NULL,
	u_image TEXT,
	u_phone BIGSERIAL,
	u_adress VARCHAR(40),
	u_state BOOLEAN NOT NULL,
	role_id SERIAL
);
/*Relacion Users Roles*/
ALTER TABLE users 
   ADD CONSTRAINT fk_u_role_id
   FOREIGN KEY (role_id) 
   REFERENCES roles(role_id)
   on delete cascade;
   
/*Tabla Movies y Genres*/

CREATE TABLE movies (
	movie_id TEXT UNIQUE PRIMARY KEY NOT NULL,
	m_name VARCHAR(45) NOT NULL,
	m_description TEXT NOT NULL,
	m_image TEXT,
	m_state BOOLEAN NOT NULL,
	genre_id SERIAL
);

CREATE TABLE genres (
	genre_id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	genre_type VARCHAR(25),
	gener_state BOOLEAN NOT NULL
);

/*Ralcion Movies Generes*/
ALTER TABLE movies 
   ADD CONSTRAINT fk_m_genre_id
   FOREIGN KEY (genre_id) 
   REFERENCES genres(genre_id)
   on delete cascade;
   
 /*Tabla Reviews*/
 
 CREATE TABLE reviews (
	review_id TEXT UNIQUE PRIMARY KEY NOT NULL,
	r_title VARCHAR(40),
	r_description TEXT NOT NULL,
	r_publication_date DATE NOT NULL,
	r_score SMALLINT NOT NULL,
	r_state BOOLEAN NOT NULL,
	user_id TEXT,
	movie_id TEXT
);

/*Relaciones Reviews Users y Movies*/
ALTER TABLE reviews 
   ADD CONSTRAINT fk_r_user_id
   FOREIGN KEY (user_id) 
   REFERENCES users(user_id)
   on delete cascade;
   
ALTER TABLE reviews 
   ADD CONSTRAINT fk_r_movies_id
   FOREIGN KEY (movie_id) 
   REFERENCES movies(movie_id)
   on delete cascade;

/*Tabla Comments_*/
CREATE TABLE comments_ (
	comment_id TEXT UNIQUE PRIMARY KEY NOT NULL,
	c_description VARCHAR(45) NOT NULL,
	c_publication_date DATE NOT NULL,
	c_state BOOLEAN NOT NULL,
	user_id TEXT,
	movie_id TEXT
);
/*Relaciones Comments_ Users Movies*/
ALTER TABLE comments_ 
   ADD CONSTRAINT fk_c_user_id
   FOREIGN KEY (user_id) 
   REFERENCES users(user_id)
   on delete cascade;
   
ALTER TABLE comments_ 
   ADD CONSTRAINT fk_c_movie_id
   FOREIGN KEY (movie_id) 
   REFERENCES movies(movie_id)
   on delete cascade;
   
/*Tablas Movie_list Movie_list_movies*/
CREATE TABLE movie_list(
	m_list_id TEXT UNIQUE PRIMARY KEY NOT NULL,
	m_list_title VARCHAR(40) NOT NULL,
	m_list_description TEXT,
	m_list_favorite BOOLEAN NOT NULL,
	m_list_state BOOLEAN NOT NULL
); 

CREATE TABLE m_list_movies(
	m_list_movie_id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	m_list_id TEXT,
	movie_id TEXT
);

/*Relaciones Movie_list Movie_list_movies Movies*/
ALTER TABLE m_list_movies 
   ADD CONSTRAINT fk_mlm_m_list_id
   FOREIGN KEY (m_list_id) 
   REFERENCES movie_list(m_list_id)
   on delete cascade;

ALTER TABLE m_list_movies 
   ADD CONSTRAINT fk_mlm_movies_id
   FOREIGN KEY (movie_id) 
   REFERENCES movies(movie_id)
   on delete cascade;

/*Tabla Movie_list_users*/
CREATE TABLE m_list_users(
	m_list_user_id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	m_list_id TEXT,
	user_id TEXT
);

/*Relaciones Movie_list_user User Movie_list*/
ALTER TABLE m_list_users 
   ADD CONSTRAINT fk_mlu_m_list_id
   FOREIGN KEY (m_list_id) 
   REFERENCES movie_list(m_list_id)
   on delete cascade;
   
ALTER TABLE m_list_users 
   ADD CONSTRAINT fk_mlu_user_id
   FOREIGN KEY (user_id) 
   REFERENCES users(user_id)
   on delete cascade;
   