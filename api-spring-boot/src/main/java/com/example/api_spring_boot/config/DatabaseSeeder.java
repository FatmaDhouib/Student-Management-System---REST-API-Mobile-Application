package com.example.api_spring_boot.config;

import com.example.api_spring_boot.entity.Departement;
import com.example.api_spring_boot.entity.Etudiant;
import com.example.api_spring_boot.repository.DepartementRepository;
import com.example.api_spring_boot.repository.EtudiantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!test")
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(EtudiantRepository etudiantRepo, DepartementRepository depRepo) {
        return args -> {
            if (depRepo.count() == 0) {
                Departement it = depRepo.save(Departement.builder().nom("Informatique").build());
                Departement math = depRepo.save(Departement.builder().nom("Mathématiques").build());

                if (etudiantRepo.count() == 0) {
                    etudiantRepo.saveAll(List.of(
                            Etudiant.builder().cin("11111111").nom("Ahmed Ben Ali").dateNaissance(LocalDate.of(2000, 5, 12))
                                    .email("ahmed@example.com").anneePremiereInscription(2022).departement(it).build(),
                            Etudiant.builder().cin("22222222").nom("Sami Trabelsi").dateNaissance(LocalDate.of(1999, 8, 20))
                                    .email("sami@example.com").anneePremiereInscription(2021).departement(it).build(),
                            Etudiant.builder().cin("33333333").nom("Fatma Dhouib").dateNaissance(LocalDate.of(2001, 2, 15))
                                    .email("fatma@example.com").anneePremiereInscription(2023).departement(math).build(),
                            Etudiant.builder().cin("44444444").nom("Youssef Gharbi").dateNaissance(LocalDate.of(1998, 11, 30))
                                    .email("youssef@example.com").anneePremiereInscription(2020).departement(it).build(),
                            Etudiant.builder().cin("55555555").nom("Amina Mansour").dateNaissance(LocalDate.of(2002, 7, 5))
                                    .email("amina@example.com").anneePremiereInscription(2024).departement(math).build()
                    ));
                    System.out.println("Base de données initialisée avec 5 étudiants et 2 départements.");
                }
            }
        };
    }
}
