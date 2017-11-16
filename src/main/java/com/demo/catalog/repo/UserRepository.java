package com.demo.catalog.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.demo.catalog.domain.SecureUser;

@RepositoryRestResource
public interface UserRepository extends MongoRepository<SecureUser, String> {

	public SecureUser findByUsername(@Param("username")String username);
	
	public List<SecureUser> findByUsernameContaining(@Param("username")String username);

}
