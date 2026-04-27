package com.example.apispringboot.controller;

import com.example.apispringboot.dto.EtudiantDTO;
import com.example.apispringboot.service.EtudiantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;

    @GetMapping
    public List<EtudiantDTO> getAll(
            @RequestParam(required = false) Integer annee,
            @RequestParam(required = false) Long deptId) {
        if (deptId != null) {
            return etudiantService.findByDepartement(deptId);
        }
        return etudiantService.findByAnnee(annee);
    }

    @GetMapping("/{id}")
    public EtudiantDTO getById(@PathVariable Long id) {
        return etudiantService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EtudiantDTO create(@RequestBody EtudiantDTO dto) {
        return etudiantService.save(dto);
    }

    @PutMapping("/{id}")
    public EtudiantDTO update(@PathVariable Long id, @RequestBody EtudiantDTO dto) {
        return etudiantService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        etudiantService.delete(id);
    }
}