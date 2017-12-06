package com.demo.catalog.controller;

import java.util.List;

import lombok.Data;

@Data
public class MoviesWrapper {
	
	private String movie;
	private List<String> categories;

}
