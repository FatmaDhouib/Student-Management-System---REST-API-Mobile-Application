package com.example.api_spring_boot.service;

import com.example.api_spring_boot.dto.DepartementDTO;
import java.util.List;

public interface DepartementService {
    List<DepartementDTO> findAll();
    DepartementDTO findById(Long id);
    DepartementDTO save(DepartementDTO dto);
    DepartementDTO update(Long id, DepartementDTO dto);
    void delete(Long id);
}
