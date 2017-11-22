package com.demo.catalog.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import com.demo.catalog.domain.SecureUser;

@RepositoryRestResource(exported = true)
public interface UserRepository extends MongoRepository<SecureUser, String> {
	
	@RestResource(exported = false)
	public SecureUser findByUsername(@Param("username")String username);
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<SecureUser> findByUsernameStartingWith(@Param("username")String username);
	
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<SecureUser> findAll();
	
	@Override
	@RestResource(exported = false)
	void deleteAll();
	
	

}
