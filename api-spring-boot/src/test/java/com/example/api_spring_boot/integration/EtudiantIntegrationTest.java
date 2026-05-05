package com.example.api_spring_boot.integration;

import com.example.api_spring_boot.entity.Etudiant;
import com.example.api_spring_boot.repository.EtudiantRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class EtudiantIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("eureka.client.enabled", () -> "false"); // Disable Eureka in tests
        registry.add("spring.data.redis.host", () -> "localhost"); // Could mock Redis, but for basic DB integration this is fine.
    }

    @Autowired
    private EtudiantRepository repository;

    @AfterEach
    void cleanUp() {
        repository.deleteAll();
    }

    @Test
    void shouldPersistAndRetrieveEtudiant() {
        // given
        Etudiant e = new Etudiant();
        e.setNom("Dupont Integration");
        e.setCin("12345678");
        e.setEmail("dupont@test.com");
        e.setDateNaissance(LocalDate.of(2000, 1, 1));
        
        // when
        repository.save(e);
        List<Etudiant> all = repository.findAll();

        // then
        assertThat(all).isNotEmpty();
        assertThat(all.get(0).getNom()).isEqualTo("Dupont Integration");
    }
}
