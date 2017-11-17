package com.demo.catalog.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.Data;
import lombok.ToString;

@Document(collection = "users")
@Data
@ToString(exclude = "password")
public class SecureUser {
	
	public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();
	public static final String DEFAULT_PASSWORD = "demo";
	public static final String ROLE_ADMIN = "ROLE_ADMIN";
	public static final String ROLE_CREATE_USER = "ROLE_CREATE_USER";
	public static final String ROLE_USER = "ROLE_USER";

	private @Id String id;

	private String username;
	
	private String password = SecureUser.PASSWORD_ENCODER.encode(SecureUser.DEFAULT_PASSWORD);
	
	private String role;


}
