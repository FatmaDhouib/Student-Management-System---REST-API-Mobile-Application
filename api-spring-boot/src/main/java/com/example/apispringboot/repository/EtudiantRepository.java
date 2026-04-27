package com.example.apispringboot.repository;

import com.example.apispringboot.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    List<Etudiant> findByAnneePremiereInscription(int annee);
    List<Etudiant> findByDepartementId(Long departementId);
}
