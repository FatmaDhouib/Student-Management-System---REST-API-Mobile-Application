package com.example.apispringboot.controller;

import com.example.apispringboot.dto.DepartementDTO;
import com.example.apispringboot.service.DepartementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
@RequiredArgsConstructor
public class DepartementController {

    private final DepartementService departementService;

    @GetMapping
    public List<DepartementDTO> getAll() {
        return departementService.findAll();
    }

    @GetMapping("/{id}")
    public DepartementDTO getById(@PathVariable Long id) {
        return departementService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartementDTO create(@RequestBody DepartementDTO dto) {
        return departementService.save(dto);
    }

    @PutMapping("/{id}")
    public DepartementDTO update(@PathVariable Long id, @RequestBody DepartementDTO dto) {
        return departementService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        departementService.delete(id);
    }
}
