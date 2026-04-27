package com.example.gradingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "api-spring-boot")
public interface StudentClient {

    @GetMapping("/api/etudiants/{id}")
    Object getStudentById(@PathVariable("id") Long id);
}