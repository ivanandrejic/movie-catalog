package com.demo.catalog.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.demo.catalog.domain.MovieCategory;

@RepositoryRestResource
public interface MovieCategorieRepository extends MongoRepository<MovieCategory, String>{
	
	public List<MovieCategory> findByTitleStartingWith(@Param("title") String title);

}
