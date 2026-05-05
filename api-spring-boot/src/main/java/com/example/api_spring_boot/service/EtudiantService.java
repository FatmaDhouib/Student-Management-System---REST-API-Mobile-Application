package com.example.api_spring_boot.service;

import com.example.api_spring_boot.dto.EtudiantDTO;
import java.util.List;

public interface EtudiantService {
    List<EtudiantDTO> findAll();
    EtudiantDTO findById(Long id);
    EtudiantDTO save(EtudiantDTO dto);
    EtudiantDTO update(Long id, EtudiantDTO dto);
    void delete(Long id);
    List<EtudiantDTO> findByAnnee(int annee);
}
