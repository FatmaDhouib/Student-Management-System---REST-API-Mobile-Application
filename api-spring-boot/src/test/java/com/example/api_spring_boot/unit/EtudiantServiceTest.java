package com.example.api_spring_boot.unit;

import com.example.api_spring_boot.dto.EtudiantDTO;
import com.example.api_spring_boot.entity.Departement;
import com.example.api_spring_boot.entity.Etudiant;
import com.example.api_spring_boot.exception.ResourceNotFoundException;
import com.example.api_spring_boot.mapper.EtudiantMapper;
import com.example.api_spring_boot.repository.DepartementRepository;
import com.example.api_spring_boot.repository.EtudiantRepository;
import com.example.api_spring_boot.service.impl.EtudiantServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EtudiantServiceTest {

    @Mock
    private EtudiantRepository etudiantRepository;

    @Mock
    private DepartementRepository departementRepository;

    @Mock
    private EtudiantMapper mapper;

    @InjectMocks
    private EtudiantServiceImpl service;

    @Test
    void shouldReturnAllEtudiants() {
        // given
        Etudiant etudiant = new Etudiant();
        etudiant.setId(1L);
        when(etudiantRepository.findAll()).thenReturn(List.of(etudiant));

        EtudiantDTO dto = new EtudiantDTO();
        dto.setId(1L);
        when(mapper.toDTO(etudiant)).thenReturn(dto);

        // when
        List<EtudiantDTO> result = service.findAll();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        verify(etudiantRepository, times(1)).findAll();
    }

    @Test
    void shouldFindById() {
        // given
        Etudiant etudiant = new Etudiant();
        etudiant.setId(1L);
        when(etudiantRepository.findById(1L)).thenReturn(Optional.of(etudiant));

        EtudiantDTO dto = new EtudiantDTO();
        dto.setId(1L);
        when(mapper.toDTO(etudiant)).thenReturn(dto);

        // when
        EtudiantDTO result = service.findById(1L);

        // then
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void shouldThrowExceptionWhenEtudiantNotFound() {
        // given
        when(etudiantRepository.findById(99L)).thenReturn(Optional.empty());

        // when & then
        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    void shouldSaveEtudiantWithoutDepartement() {
        // given
        EtudiantDTO inputDto = new EtudiantDTO();
        inputDto.setNom("Dupont");

        Etudiant etudiantToSave = new Etudiant();
        etudiantToSave.setNom("Dupont");

        Etudiant savedEtudiant = new Etudiant();
        savedEtudiant.setId(1L);
        savedEtudiant.setNom("Dupont");

        EtudiantDTO outputDto = new EtudiantDTO();
        outputDto.setId(1L);
        outputDto.setNom("Dupont");

        when(mapper.toEntity(inputDto)).thenReturn(etudiantToSave);
        when(etudiantRepository.save(any(Etudiant.class))).thenReturn(savedEtudiant);
        when(mapper.toDTO(savedEtudiant)).thenReturn(outputDto);

        // when
        EtudiantDTO result = service.save(inputDto);

        // then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getNom()).isEqualTo("Dupont");
        verify(departementRepository, never()).findById(anyLong());
    }

    @Test
    void shouldSaveEtudiantWithDepartement() {
        // given
        EtudiantDTO inputDto = new EtudiantDTO();
        inputDto.setNom("Martin");
        inputDto.setDepartementId(10L);

        Etudiant etudiantToSave = new Etudiant();
        etudiantToSave.setNom("Martin");

        Departement dep = new Departement();
        dep.setId(10L);
        dep.setNom("Informatique");

        Etudiant savedEtudiant = new Etudiant();
        savedEtudiant.setId(2L);
        savedEtudiant.setNom("Martin");
        savedEtudiant.setDepartement(dep);

        EtudiantDTO outputDto = new EtudiantDTO();
        outputDto.setId(2L);
        outputDto.setNom("Martin");
        outputDto.setDepartementId(10L);

        when(mapper.toEntity(inputDto)).thenReturn(etudiantToSave);
        when(departementRepository.findById(10L)).thenReturn(Optional.of(dep));
        when(etudiantRepository.save(any(Etudiant.class))).thenReturn(savedEtudiant);
        when(mapper.toDTO(savedEtudiant)).thenReturn(outputDto);

        // when
        EtudiantDTO result = service.save(inputDto);

        // then
        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getDepartementId()).isEqualTo(10L);
        verify(departementRepository, times(1)).findById(10L);
    }
}
