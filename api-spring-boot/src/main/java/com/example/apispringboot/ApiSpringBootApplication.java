package com.example.apispringboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableCaching
@EnableFeignClients
public class ApiSpringBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiSpringBootApplication.class, args);
    }

}
