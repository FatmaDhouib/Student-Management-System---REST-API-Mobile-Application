package com.example.api_spring_boot.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtudiantEvent {
    private Long etudiantId;
    private String nom;
    private String email;
    private LocalDateTime timestamp;
}
