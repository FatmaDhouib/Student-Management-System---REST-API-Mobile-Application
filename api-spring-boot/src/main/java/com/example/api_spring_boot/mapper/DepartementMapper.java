package com.example.api_spring_boot.mapper;

import com.example.api_spring_boot.dto.DepartementDTO;
import com.example.api_spring_boot.entity.Departement;

public interface DepartementMapper {
    DepartementDTO toDTO(Departement departement);
    Departement toEntity(DepartementDTO dto);
}
