package com.example.grading_service.service.impl;

import com.example.grading_service.dto.EtudiantDTO;
import com.example.grading_service.dto.NoteDTO;
import com.example.grading_service.entity.Note;
import com.example.grading_service.exception.ResourceNotFoundException;
import com.example.grading_service.feign.EtudiantClient;
import com.example.grading_service.mapper.NoteMapper;
import com.example.grading_service.repository.NoteRepository;
import com.example.grading_service.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;
    private final EtudiantClient etudiantClient;

    @Override
    public List<NoteDTO> findAll() {
        return noteRepository.findAll().stream()
                .map(noteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NoteDTO> findByStudentId(Long studentId) {
        return noteRepository.findByStudentId(studentId).stream()
                .map(noteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NoteDTO findById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id " + id));
        return noteMapper.toDTO(note);
    }

    @Override
    public NoteDTO save(NoteDTO noteDTO) {
        // Verify student exists using Feign Client
        try {
            EtudiantDTO etudiant = etudiantClient.getEtudiantById(noteDTO.getStudentId());
            if (etudiant == null) {
                throw new ResourceNotFoundException("Student not found with id " + noteDTO.getStudentId());
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException("Failed to verify student existence: " + e.getMessage());
        }

        Note note = noteMapper.toEntity(noteDTO);
        Note savedNote = noteRepository.save(note);
        return noteMapper.toDTO(savedNote);
    }

    @Override
    public void delete(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note not found with id " + id);
        }
        noteRepository.deleteById(id);
    }
}
