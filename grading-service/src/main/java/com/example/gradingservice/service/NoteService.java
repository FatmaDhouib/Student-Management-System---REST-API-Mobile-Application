package com.example.gradingservice.service;

import com.example.gradingservice.client.StudentClient;
import com.example.gradingservice.dto.NoteDTO;
import com.example.gradingservice.mapper.NoteMapper;
import com.example.gradingservice.model.Note;
import com.example.gradingservice.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final StudentClient studentClient;

    public NoteDTO create(NoteDTO noteDTO) {

        try {
            studentClient.getStudentById(noteDTO.getStudentId());
        } catch (Exception e) {
            throw new RuntimeException("Student not found with id: " + noteDTO.getStudentId());
        }

        Note note = NoteMapper.toEntity(noteDTO);
        return NoteMapper.toDTO(noteRepository.save(note));
    }

    public NoteDTO getById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        return NoteMapper.toDTO(note);
    }

    public List<NoteDTO> getAll() {
        return noteRepository.findAll()
                .stream()
                .map(NoteMapper::toDTO)
                .collect(Collectors.toList());
    }

    public NoteDTO update(Long id, NoteDTO noteDTO) {

        Note existing = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        try {
            studentClient.getStudentById(noteDTO.getStudentId());
        } catch (Exception e) {
            throw new RuntimeException("Student not found with id: " + noteDTO.getStudentId());
        }

        existing.setStudentId(noteDTO.getStudentId());
        existing.setMatiere(noteDTO.getMatiere());
        existing.setValeur(noteDTO.getValeur());

        return NoteMapper.toDTO(noteRepository.save(existing));
    }

    public void delete(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new RuntimeException("Note not found with id: " + id);
        }
        noteRepository.deleteById(id);
    }
}