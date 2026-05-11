package com.example.api_spring_boot.controller;

import com.example.api_spring_boot.dto.DepartementDTO;
import com.example.api_spring_boot.service.DepartementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
@RequiredArgsConstructor
@Tag(name = "Departement API", description = "Operations related to Departments")
@CrossOrigin(origins = "*")
public class DepartementController {

    private final DepartementService departementService;

    @GetMapping
    @Operation(summary = "Get all departments")
    public List<DepartementDTO> getAll() {
        return departementService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public DepartementDTO getById(@PathVariable Long id) {
        return departementService.findById(id);
    }

    @PostMapping
    @Operation(summary = "Create a new department")
    public ResponseEntity<DepartementDTO> create(@RequestBody DepartementDTO dto) {
        return new ResponseEntity<>(departementService.save(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing department")
    public DepartementDTO update(@PathVariable Long id, @RequestBody DepartementDTO dto) {
        return departementService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a department")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        departementService.delete(id);
    }
}
