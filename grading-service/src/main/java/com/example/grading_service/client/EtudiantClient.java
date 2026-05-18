package com.example.grading_service.client;

import com.example.grading_service.dto.EtudiantDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class EtudiantClient {

    @Value("${clients.etudiant-service.url}")
    private String etudiantServiceUrl;

    private final RestClient restClient = RestClient.create();

    public EtudiantDTO getEtudiantById(Long id) {
        return restClient.get()
                .uri(etudiantServiceUrl + "/api/etudiants/{id}", id)
                .retrieve()
                .body(EtudiantDTO.class);
    }
}
