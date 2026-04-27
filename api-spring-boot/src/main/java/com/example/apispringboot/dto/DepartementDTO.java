package com.example.apispringboot.dto;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartementDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String nom;
}
