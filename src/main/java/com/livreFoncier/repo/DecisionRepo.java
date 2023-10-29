package com.livreFoncier.repo;

import com.livreFoncier.model.Decision;
import com.livreFoncier.model.Dossier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecisionRepo extends JpaRepository<Decision,Long> {
    List<Decision> findByDossierId(Long Id);
    Decision findTopByDossierOrderByIdDesc(Dossier dossier);
}
