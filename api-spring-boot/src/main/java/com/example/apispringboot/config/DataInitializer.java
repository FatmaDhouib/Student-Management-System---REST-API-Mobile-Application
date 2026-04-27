package com.example.apispringboot.config;

import com.example.apispringboot.model.Etudiant;
import com.example.apispringboot.repository.EtudiantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EtudiantRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(Etudiant.builder()
                        .cin("11111111")
                        .nom("Ali")
                        .dateNaissance(LocalDate.of(2000, 1, 15))
                        .build());

                repository.save(Etudiant.builder()
                        .cin("22222222")
                        .nom("Sara")
                        .dateNaissance(LocalDate.of(2001, 3, 22))
                        .build());

                repository.save(Etudiant.builder()
                        .cin("33333333")
                        .nom("Youssef")
                        .dateNaissance(LocalDate.of(1999, 7, 10))
                        .build());

                repository.save(Etudiant.builder()
                        .cin("44444444")
                        .nom("Amira")
                        .dateNaissance(LocalDate.of(2002, 11, 5))
                        .build());

                repository.save(Etudiant.builder()
                        .cin("55555555")
                        .nom("Karim")
                        .dateNaissance(LocalDate.of(2000, 9, 30))
                        .build());
            }
        };
    }
}