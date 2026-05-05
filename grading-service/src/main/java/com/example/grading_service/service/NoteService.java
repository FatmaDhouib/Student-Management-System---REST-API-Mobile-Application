package com.example.grading_service.service;

import com.example.grading_service.dto.NoteDTO;
import java.util.List;

public interface NoteService {
    List<NoteDTO> findAll();
    List<NoteDTO> findByStudentId(Long studentId);
    NoteDTO findById(Long id);
    NoteDTO save(NoteDTO noteDTO);
    void delete(Long id);
}
