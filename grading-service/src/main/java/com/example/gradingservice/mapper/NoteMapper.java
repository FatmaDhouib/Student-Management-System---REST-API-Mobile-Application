package com.example.gradingservice.mapper;

import com.example.gradingservice.dto.NoteDTO;
import com.example.gradingservice.model.Note;

public class NoteMapper {

    public static NoteDTO toDTO(Note note) {
        if (note == null) return null;

        return NoteDTO.builder()
                .id(note.getId())
                .studentId(note.getStudentId())
                .matiere(note.getMatiere())
                .valeur(note.getValeur())
                .build();
    }

    public static Note toEntity(NoteDTO dto) {
        if (dto == null) return null;

        return Note.builder()
                .id(dto.getId())
                .studentId(dto.getStudentId())
                .matiere(dto.getMatiere())
                .valeur(dto.getValeur())
                .build();
    }
}