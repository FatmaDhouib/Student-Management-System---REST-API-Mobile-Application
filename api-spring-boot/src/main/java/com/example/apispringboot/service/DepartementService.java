package com.example.apispringboot.service;

import com.example.apispringboot.dto.DepartementDTO;
import com.example.apispringboot.model.Departement;
import com.example.apispringboot.exception.ResourceNotFoundException;
import com.example.apispringboot.mapper.DepartementMapper;
import com.example.apispringboot.repository.DepartementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartementService {

    private final DepartementRepository departementRepository;
    private final DepartementMapper departementMapper;

    public List<DepartementDTO> findAll() {
        return departementRepository.findAll()
                .stream()
                .map(departementMapper::toDTO)
                .toList();
    }

    public DepartementDTO findById(Long id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Département introuvable avec id " + id));
        return departementMapper.toDTO(departement);
    }

    public DepartementDTO save(DepartementDTO dto) {
        Departement departement = departementMapper.toEntity(dto);
        return departementMapper.toDTO(departementRepository.save(departement));
    }

    public DepartementDTO update(Long id, DepartementDTO dto) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Département introuvable avec id " + id));

        departement.setNom(dto.getNom());

        return departementMapper.toDTO(departementRepository.save(departement));
    }

    public void delete(Long id) {
        if (!departementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Département introuvable avec id " + id);
        }
        departementRepository.deleteById(id);
    }
}
