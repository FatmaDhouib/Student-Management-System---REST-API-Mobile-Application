package com.example.api_spring_boot.mapper;

import com.example.api_spring_boot.dto.EtudiantDTO;
import com.example.api_spring_boot.entity.Etudiant;

public interface EtudiantMapper {
    EtudiantDTO toDTO(Etudiant etudiant);
    Etudiant toEntity(EtudiantDTO dto);
}
