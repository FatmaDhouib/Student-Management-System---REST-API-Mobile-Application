package com.example.gradingservice.controller;

import com.example.gradingservice.dto.NoteDTO;
import com.example.gradingservice.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public NoteDTO create(@Valid @RequestBody NoteDTO noteDTO) {
        return noteService.create(noteDTO);
    }

    @GetMapping("/{id}")
    public NoteDTO getById(@PathVariable Long id) {
        return noteService.getById(id);
    }

    @GetMapping
    public List<NoteDTO> getAll() {
        return noteService.getAll();
    }

    @PutMapping("/{id}")
    public NoteDTO update(@PathVariable Long id, @RequestBody NoteDTO noteDTO) {
        return noteService.update(id, noteDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        noteService.delete(id);
    }
}
