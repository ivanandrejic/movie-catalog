package com.demo.catalog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.demo.catalog.domain.Movie;
import com.demo.catalog.domain.MovieCategory;
import com.demo.catalog.repo.MovieCategorieRepository;
import com.demo.catalog.repo.MovieRepository;

@RestController
@RequestMapping("/rest/movies-controll")
public class MovieControler {
	
	@Autowired
	MovieRepository movieRepository;
	
	@Autowired
	MovieCategorieRepository categoryRepo;
	
	@RequestMapping(method = RequestMethod.POST)
    public void saveCategory(@RequestBody MoviesWrapper request){
        Movie movie = movieRepository.findOne(request.getMovie());
        for (String categoryId: request.getCategories()) {
        	MovieCategory findOne = categoryRepo.findOne(categoryId);
        	movie.getCategories().add(findOne);
        }
        movieRepository.save(movie);
    }

}
