package com.example.grading_service.kafka;

import com.example.grading_service.dto.NoteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, NoteEvent> kafkaTemplate;

    public void publishNoteCreated(NoteDTO note) {
        NoteEvent event = NoteEvent.builder()
                .studentId(note.getStudentId())
                .matiere(note.getMatiere())
                .valeur(note.getValeur())
                .build();
        kafkaTemplate.send("note-created", event);
    }
}
