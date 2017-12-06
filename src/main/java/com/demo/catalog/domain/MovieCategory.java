package com.demo.catalog.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "category")
@Data
public class MovieCategory {
	
	private @Id String id;
	
	private String title;
	private String description;
	
	@DBRef
	private List<Movie> movies;

}
