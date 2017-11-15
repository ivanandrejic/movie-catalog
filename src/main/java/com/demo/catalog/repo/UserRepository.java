package com.demo.catalog.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.demo.catalog.domain.User;

@RepositoryRestResource
public interface UserRepository extends MongoRepository<User, String>{

}
