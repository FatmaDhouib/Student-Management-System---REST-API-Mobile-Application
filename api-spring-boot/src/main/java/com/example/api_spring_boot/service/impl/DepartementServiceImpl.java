package com.example.api_spring_boot.service.impl;

import com.example.api_spring_boot.dto.DepartementDTO;
import com.example.api_spring_boot.entity.Departement;
import com.example.api_spring_boot.mapper.DepartementMapper;
import com.example.api_spring_boot.repository.DepartementRepository;
import com.example.api_spring_boot.service.DepartementService;
import com.example.api_spring_boot.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartementServiceImpl implements DepartementService {

    private final DepartementRepository repository;
    private final DepartementMapper mapper;

    @Override
    public List<DepartementDTO> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DepartementDTO findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Departement not found with id: " + id));
    }

    @Override
    public DepartementDTO save(DepartementDTO dto) {
        Departement departement = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(departement));
    }

    @Override
    public DepartementDTO update(Long id, DepartementDTO dto) {
        Departement departement = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departement not found with id: " + id));
        departement.setNom(dto.getNom());
        return mapper.toDTO(repository.save(departement));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
