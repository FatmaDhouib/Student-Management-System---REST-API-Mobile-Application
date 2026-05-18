package com.example.api_spring_boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;


@SpringBootApplication
@EnableCaching

public class ApiSpringBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiSpringBootApplication.class, args);
	}

}
