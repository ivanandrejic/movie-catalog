package com.demo.catalog.repo;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.demo.catalog.domain.Movie;

@RepositoryRestResource
public interface MovieRepository extends MongoRepository<Movie, String> {
	
	public Movie findByTitle(@Param("title") String title);
	
	public List<Movie> findByMainActor(@Param("mainActor") String mainActor);
	
	public List<Movie> findByCategory(@Param("category") String category);
	
	public List<Movie> findByReleaseDate(@Param("releaseDate") Date releaseDate);

}
