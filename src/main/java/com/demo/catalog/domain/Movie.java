package com.demo.catalog.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
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
	

}
