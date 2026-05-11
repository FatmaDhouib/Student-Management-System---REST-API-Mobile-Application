package com.example.api_spring_boot.service.impl;

import com.example.api_spring_boot.dto.EtudiantDTO;
import com.example.api_spring_boot.entity.Departement;
import com.example.api_spring_boot.entity.Etudiant;
import com.example.api_spring_boot.mapper.EtudiantMapper;
import com.example.api_spring_boot.repository.DepartementRepository;
import com.example.api_spring_boot.repository.EtudiantRepository;
import com.example.api_spring_boot.service.EtudiantService;
import com.example.api_spring_boot.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EtudiantServiceImpl implements EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final DepartementRepository departementRepository;
    private final EtudiantMapper mapper;
    private final com.example.api_spring_boot.kafka.KafkaProducerService kafkaProducerService;

    @Override
    @Cacheable(value = "etudiants")
    public List<EtudiantDTO> findAll() {
        return etudiantRepository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "etudiants", key = "#id")
    public EtudiantDTO findById(Long id) {
        return etudiantRepository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant not found with id: " + id));
    }

    @Override
    @CacheEvict(value = "etudiants", allEntries = true)
    public EtudiantDTO save(EtudiantDTO dto) {
        Etudiant etudiant = mapper.toEntity(dto);
        if (dto.getDepartementId() != null) {
            Departement dep = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new ResourceNotFoundException("Departement not found with id: " + dto.getDepartementId()));
            etudiant.setDepartement(dep);
        }
        EtudiantDTO saved = mapper.toDTO(etudiantRepository.save(etudiant));
        kafkaProducerService.publishEtudiantCreated(saved);
        return saved;
    }

    @Override
    @CacheEvict(value = "etudiants", allEntries = true)
    public EtudiantDTO update(Long id, EtudiantDTO dto) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant not found with id: " + id));
        
        etudiant.setNom(dto.getNom());
        etudiant.setCin(dto.getCin());
        etudiant.setDateNaissance(dto.getDateNaissance());
        etudiant.setEmail(dto.getEmail());
        etudiant.setAnneePremiereInscription(dto.getAnneePremiereInscription());

        if (dto.getDepartementId() != null) {
            Departement dep = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new ResourceNotFoundException("Departement not found with id: " + dto.getDepartementId()));
            etudiant.setDepartement(dep);
        } else {
            etudiant.setDepartement(null);
        }

        return mapper.toDTO(etudiantRepository.save(etudiant));
    }

    @Override
    @CacheEvict(value = "etudiants", allEntries = true)
    public void delete(Long id) {
        etudiantRepository.deleteById(id);
    }

    @Override
    public List<EtudiantDTO> findByAnnee(int annee) {
        return etudiantRepository.findByAnneePremiereInscription(annee).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
