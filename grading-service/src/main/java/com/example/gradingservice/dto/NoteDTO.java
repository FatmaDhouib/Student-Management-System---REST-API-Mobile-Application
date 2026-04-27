package com.example.gradingservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteDTO {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Matiere is required")
    private String matiere;

    @NotNull(message = "Valeur is required")
    @Min(value = 0, message = "Min value is 0")
    @Max(value = 20, message = "Max value is 20")
    private Double valeur;
}
