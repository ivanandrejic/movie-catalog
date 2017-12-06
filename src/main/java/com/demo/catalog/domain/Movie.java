package com.demo.catalog.domain;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "movies")
@Data
public class Movie {
	
	private @Id String id;
	
	private String title;
	private String category;
	private Date releaseDate;
	private String mainActor;
	private String iconData;
	
	@DBRef
	private Set<MovieCategory> categories = new HashSet<>();
	

}
