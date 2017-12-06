package com.demo.catalog.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "category")
@Data
public class MovieCategory {
	
	private @Id String id;
	
	private String title;
	private String description;

}
