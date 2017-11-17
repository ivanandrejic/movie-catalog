package com.demo.catalog.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.demo.catalog.domain.SecureUser;

@RepositoryRestResource(exported = false)
public interface LoginRepository extends MongoRepository<SecureUser, String> {

	public SecureUser findByUsername(@Param("username")String username);
	
}
