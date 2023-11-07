package com.livreFoncier.controller;

import com.livreFoncier.exception.LivreNotFoundException;
import com.livreFoncier.model.Decision;
import com.livreFoncier.model.Dossier;
import com.livreFoncier.repo.DecisionRepo;
import com.livreFoncier.repo.DossierRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
public class DecisionController {
    private final DecisionRepo decisionRepo;
    private final DossierRepo dossierRepo;

    public DecisionController(DecisionRepo decisionRepo, DossierRepo dossierRepo) {
        this.decisionRepo = decisionRepo;
        this.dossierRepo = dossierRepo;
    }

    @GetMapping("/decisions/{dossierId}")
    public ResponseEntity<List<Decision>> getAllDecisions(@PathVariable("dossierId") Long dossierId) {
        List<Decision> decisions = decisionRepo.findByDossierId(dossierId);
        return new ResponseEntity<>(decisions, HttpStatus.OK);
    }

    @GetMapping("/decision/{id}")
    public ResponseEntity<Decision> getDecisionById(@PathVariable("id") Long id) {
        Decision decision = decisionRepo.findById(id).orElseThrow(() -> new LivreNotFoundException("decision not found"));
        return new ResponseEntity<>(decision, HttpStatus.OK);
    }

    @PostMapping("/decision/{dossierId}")
    public ResponseEntity<Decision> addDecision(@Valid @RequestBody Decision decision, @PathVariable("dossierId") Long id) {
        Dossier dossier = dossierRepo.findById(id).get();
        decision.setDossier(dossier);
        Decision newDecision = decisionRepo.save(decision);
        dossier.setLastDecisionDate(newDecision.getDscDate());
        dossierRepo.save(dossier);
        return new ResponseEntity<>(newDecision, HttpStatus.CREATED);
    }

    @PutMapping("/decision")
    public ResponseEntity<Decision> updateDecision(@Valid @RequestBody Decision decision) {
        Decision updateDecision = decisionRepo.save(decision);
        Decision decisionToCheck = decisionRepo.findTopByDossierOrderByIdDesc(decision.getDossier());
        if (updateDecision.getId().equals(decisionToCheck.getId())) {
            Dossier dossier = dossierRepo.getById(updateDecision.getDossier().getId());
            dossier.setLastDecisionDate(updateDecision.getDscDate());
            dossierRepo.save(dossier);
        }
        return new ResponseEntity<>(updateDecision, HttpStatus.OK);
    }

    @DeleteMapping("/decision/{id}")
    public ResponseEntity<?> deleteDecision(@PathVariable("id") Long id) {
        Decision decision = decisionRepo.findById(id).orElseThrow(() -> new LivreNotFoundException("decision not found"));
        decisionRepo.deleteById(id);
        Decision decisionToCheck = decisionRepo.findTopByDossierOrderByIdDesc(decision.getDossier());
        Dossier dossier = dossierRepo.getById(decision.getDossier().getId());
        if (decisionToCheck != null) {
            dossier.setLastDecisionDate(decision.getDscDate());
            dossierRepo.save(dossier);
        } else {
            dossier.setLastDecisionDate(null);
            dossierRepo.save(dossier);
        }
        return new ResponseEntity<>(id, HttpStatus.OK);

    }
}
