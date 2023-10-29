package com.livreFoncier.controller;

import com.livreFoncier.model.DecisionName;
import com.livreFoncier.repo.DecisionNameRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class DecisionNameController {
    private final DecisionNameRepo decisionNameRepo;

    public DecisionNameController(DecisionNameRepo decisionNameRepo) {this.decisionNameRepo = decisionNameRepo;}

    @GetMapping("/decisionName")
    public ResponseEntity<List<DecisionName>> getAllDecisionNames () {
        List<DecisionName> decisionNames = decisionNameRepo.findAll();
        return new ResponseEntity<>(decisionNames, HttpStatus.OK);
    }

    @GetMapping("/decisionName/{id}")
    public ResponseEntity<DecisionName> getDecisionNameById (@PathVariable("id") Long id) {
        DecisionName decisionName = decisionNameRepo.findById(id).get();
        return new ResponseEntity<>(decisionName, HttpStatus.OK);
    }

    @PostMapping("/decisionName")
    public ResponseEntity<DecisionName> addDecisionName(@RequestBody DecisionName decisionName) {
        DecisionName newDecisionName = decisionNameRepo.save(decisionName);
        return new ResponseEntity<>(newDecisionName, HttpStatus.CREATED);
    }

    @PutMapping("/decisionName")
    public ResponseEntity<DecisionName> updateDecisionName(@RequestBody DecisionName decisionName) {
        DecisionName updateDecisionName = decisionNameRepo.save(decisionName);
        return new ResponseEntity<>(updateDecisionName, HttpStatus.OK);
    }

    @DeleteMapping("/decisionName/{id}")
    public ResponseEntity<?> deleteDecisionName(@PathVariable("id") Long id) {
        decisionNameRepo.deleteById(id);
        return new ResponseEntity<>(id, HttpStatus.OK);

    }
}
