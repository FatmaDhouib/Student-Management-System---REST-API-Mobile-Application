package com.example.grading_service.controller;

import com.example.grading_service.dto.NoteDTO;
import com.example.grading_service.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@Tag(name = "Note", description = "Endpoints for managing notes")
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    @Operation(summary = "Get all notes")
    public ResponseEntity<List<NoteDTO>> getAllNotes() {
        return ResponseEntity.ok(noteService.findAll());
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get notes by student ID")
    public ResponseEntity<List<NoteDTO>> getNotesByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(noteService.findByStudentId(studentId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a note by ID")
    public ResponseEntity<NoteDTO> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(noteService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new note")
    public ResponseEntity<NoteDTO> createNote(@RequestBody NoteDTO noteDTO) {
        return new ResponseEntity<>(noteService.save(noteDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing note")
    public ResponseEntity<NoteDTO> updateNote(@PathVariable Long id, @RequestBody NoteDTO noteDTO) {
        noteDTO.setId(id);
        return ResponseEntity.ok(noteService.save(noteDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a note")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
