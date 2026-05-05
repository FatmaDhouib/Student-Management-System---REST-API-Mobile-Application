package com.example.api_spring_boot.mapper;

import com.example.api_spring_boot.dto.DepartementDTO;
import com.example.api_spring_boot.entity.Departement;
import org.springframework.stereotype.Component;

@Component
public class DepartementMapper {

    public DepartementDTO toDTO(Departement departement) {
        if (departement == null) return null;
        return DepartementDTO.builder()
                .id(departement.getId())
                .nom(departement.getNom())
                .build();
    }

    public Departement toEntity(DepartementDTO dto) {
        if (dto == null) return null;
        return Departement.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .build();
    }
}
