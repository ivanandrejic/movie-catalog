package com.demo.catalog.repo;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;

import com.demo.catalog.domain.Movie;

//@RepositoryRestResource
public interface MovieRepository extends MongoRepository<Movie, String> {
	
	public Movie findByTitle(@Param("title") String title);
	
	public List<Movie> findByTitleStartingWith(@Param("title") String title);
	
	public List<Movie> findByMainActorStartingWith(@Param("mainActor") String mainActor);
	
	public List<Movie> findByCategoryStartingWith(@Param("category") String category);
	
	public List<Movie> findByReleaseDateAfter(@Param("releaseDate")@DateTimeFormat(pattern = "MM-dd-yyyy") Date releaseDate);

	@Query("{ 'title' : { $regex: '^?0' },"
			+ "'mainActor' : { $regex: '^?1' },"
			+ "'releaseDate' : { $gte : ?2 } }")
	public List<Movie> findByAll(@Param("title") String title, 
			@Param("mainActor") String mainActor,
			@Param("releaseDate")@DateTimeFormat(pattern = "MM-dd-yyyy") Date releaseDate);
	
}
