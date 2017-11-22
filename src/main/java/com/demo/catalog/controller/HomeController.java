package com.demo.catalog.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.catalog.domain.SecureUser;
import com.demo.catalog.repo.UserRepository;

@RestController
public class HomeController {
	
	@Autowired
	private UserRepository userRepo;

	@RequestMapping("/user")
	public ResponseEntity<?> user(Principal principal) {
		SecureUser user = userRepo.findByUsername(principal.getName());
		return ResponseEntity.ok(user != null ? user : principal);
	}


}
