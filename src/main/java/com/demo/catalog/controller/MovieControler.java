package com.demo.catalog.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.demo.catalog.domain.Movie;
import com.demo.catalog.domain.MovieCategory;
import com.demo.catalog.repo.MovieCategorieRepository;
import com.demo.catalog.repo.MovieRepository;

@RepositoryRestController
@RequestMapping("/movies/")
public class MovieControler {
	
	private static final String EMPTY_REGEX = "^";

	@Autowired
	MovieRepository movieRepository;

	@Autowired
	MovieCategorieRepository categoryRepo;

	@RequestMapping(method = RequestMethod.POST, value = "/categories")
	public @ResponseBody ResponseEntity<?> saveCategory(@RequestBody MoviesWrapper request) {
		Movie movie = movieRepository.findOne(request.getMovie());
		movie.getCategories().clear();
		for (String categoryId : request.getCategories()) {
			MovieCategory findOne = categoryRepo.findOne(categoryId);
			movie.getCategories().add(findOne);
		}
		movieRepository.save(movie);
		return ResponseEntity.ok(movie);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/search/findByAll/{title}/{mainActor}/{category}/{releaseDate}")
	public @ResponseBody ResponseEntity<?> findByAll(@PathVariable String title, @PathVariable String mainActor,
			@PathVariable String category, @PathVariable @DateTimeFormat(pattern = "MM-dd-yyyy") Date releaseDate) {
		
		List<Movie> all = movieRepository.findByAll(title, mainActor, releaseDate);
		List<MovieCategory> categories = categoryRepo.findByTitleStartingWith(category);
		if (!(StringUtils.isEmpty(category) || EMPTY_REGEX.equals(category))) {
			List<Movie> filtered = all.stream()
					.filter(movie -> movie.getCategories().stream().anyMatch(c -> categories.contains(c)))
					.collect(Collectors.toList());
			all = filtered;
		}
		
		List<Resource<Movie>> usersResources = new ArrayList<Resource<Movie>>(all.size());
		all.forEach((movie) -> {
			Resource<Movie> resource = new Resource<Movie>(movie);
			resource.add(ControllerLinkBuilder.linkTo(MovieControler.class).slash(movie.getId()).withSelfRel());
			usersResources.add(resource);
		});
		
		Resources<Resource<Movie>> resources = new Resources<Resource<Movie>>(usersResources); 
		resources.add(ControllerLinkBuilder.linkTo(
				ControllerLinkBuilder.methodOn(MovieControler.class).findByAll(title, mainActor, category, releaseDate))
				.withSelfRel());
		return ResponseEntity.ok(resources);
	}

}
