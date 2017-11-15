package com.demo.catalog.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.ToString;

@Document(collection = "users")
@Data
@ToString(exclude = "password")
public class User {

	private @Id String id;

	private String username;
	
	private String password;


}
