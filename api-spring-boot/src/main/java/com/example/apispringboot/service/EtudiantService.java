package com.example.apispringboot.service;

import com.example.apispringboot.dto.EtudiantDTO;
import com.example.apispringboot.model.Departement;
import com.example.apispringboot.model.Etudiant;
import com.example.apispringboot.exception.ResourceNotFoundException;
import com.example.apispringboot.mapper.EtudiantMapper;
import com.example.apispringboot.repository.DepartementRepository;
import com.example.apispringboot.repository.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final DepartementRepository departementRepository;
    private final EtudiantMapper etudiantMapper;

    @Cacheable(value = "etudiants")
    public List<EtudiantDTO> findAll() {
        return etudiantRepository.findAll()
                .stream()
                .map(etudiantMapper::toDTO)
                .toList();
    }

    @Cacheable(value = "etudiants")
    public List<EtudiantDTO> findByAnnee(Integer annee) {
        List<Etudiant> etudiants = (annee == null)
                ? etudiantRepository.findAll()
                : etudiantRepository.findByAnneePremiereInscription(annee);

        return etudiants.stream()
                .map(etudiantMapper::toDTO)
                .toList();
    }

    @Cacheable(value = "etudiants")
    public List<EtudiantDTO> findByDepartement(Long deptId) {
        List<Etudiant> etudiants = (deptId == null)
                ? etudiantRepository.findAll()
                : etudiantRepository.findByDepartementId(deptId);

        return etudiants.stream()
                .map(etudiantMapper::toDTO)
                .toList();
    }

    public EtudiantDTO findById(Long id) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable avec id " + id));
        return etudiantMapper.toDTO(etudiant);
    }

    @CacheEvict(value = "etudiants", allEntries = true)
    public EtudiantDTO save(EtudiantDTO dto) {
        Departement departement = null;
        if (dto.getDepartementId() != null) {
            departement = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new ResourceNotFoundException("Département introuvable avec id " + dto.getDepartementId()));
        }

        Etudiant etudiant = etudiantMapper.toEntity(dto, departement);
        return etudiantMapper.toDTO(etudiantRepository.save(etudiant));
    }

    @CacheEvict(value = "etudiants", allEntries = true)
    public EtudiantDTO update(Long id, EtudiantDTO dto) {
        Etudiant existing = etudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable avec id " + id));

        Departement departement = null;
        if (dto.getDepartementId() != null) {
            departement = departementRepository.findById(dto.getDepartementId())
                    .orElseThrow(() -> new ResourceNotFoundException("Département introuvable avec id " + dto.getDepartementId()));
        }

        existing.setCin(dto.getCin());
        existing.setNom(dto.getNom());
        existing.setDateNaissance(dto.getDateNaissance());
        existing.setEmail(dto.getEmail());
        existing.setAnneePremiereInscription(dto.getAnneePremiereInscription());
        existing.setDepartement(departement);

        return etudiantMapper.toDTO(etudiantRepository.save(existing));
    }

    @CacheEvict(value = "etudiants", allEntries = true)
    public void delete(Long id) {
        if (!etudiantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Étudiant introuvable avec id " + id);
        }
        etudiantRepository.deleteById(id);
    }
}