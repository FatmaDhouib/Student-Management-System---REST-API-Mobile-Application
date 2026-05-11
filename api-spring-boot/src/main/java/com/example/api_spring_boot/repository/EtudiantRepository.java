package com.example.api_spring_boot.repository;

import com.example.api_spring_boot.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    List<Etudiant> findByAnneePremiereInscription(int annee);
}
