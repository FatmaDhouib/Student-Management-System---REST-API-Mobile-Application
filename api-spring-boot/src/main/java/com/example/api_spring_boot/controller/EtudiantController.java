package com.example.api_spring_boot.controller;

import com.example.api_spring_boot.dto.EtudiantDTO;
import com.example.api_spring_boot.service.EtudiantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
@Tag(name = "Etudiant API", description = "Operations related to Students")
@CrossOrigin(origins = "*")
public class EtudiantController {

    private final EtudiantService etudiantService;

    @GetMapping
    @Operation(summary = "Get all students", description = "Retrieve a list of all students")
    public List<EtudiantDTO> getAll(@RequestParam(required = false) Integer annee) {
        if (annee != null) {
            return etudiantService.findByAnnee(annee);
        }
        return etudiantService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID")
    @ApiResponse(responseCode = "200", description = "Found the student")
    @ApiResponse(responseCode = "404", description = "Student not found")
    public EtudiantDTO getById(@PathVariable Long id) {
        return etudiantService.findById(id);
    }

    @PostMapping
    @Operation(summary = "Create a new student")
    @ApiResponse(responseCode = "201", description = "Student created successfully")
    public ResponseEntity<EtudiantDTO> create(@RequestBody EtudiantDTO dto) {
        return new ResponseEntity<>(etudiantService.save(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student")
    public EtudiantDTO update(@PathVariable Long id, @RequestBody EtudiantDTO dto) {
        return etudiantService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a student")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        etudiantService.delete(id);
    }
}
