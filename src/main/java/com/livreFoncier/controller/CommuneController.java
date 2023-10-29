package com.livreFoncier.controller;

import com.livreFoncier.exception.CommuneNotFoundException;
import com.livreFoncier.model.Commune;
import com.livreFoncier.repo.CommuneRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
public class CommuneController {
    private final CommuneRepo communeRepo;

    public CommuneController(CommuneRepo communeRepo) {
        this.communeRepo = communeRepo;
    }

    @GetMapping("/commune")
    public ResponseEntity<List<Commune>> getAllCommunes () {
        List<Commune> communes = communeRepo.findAll();
        return new ResponseEntity<>(communes, HttpStatus.OK);
    }

    @GetMapping("/commune/{id}")
    public ResponseEntity<Commune> getCommuneById (@PathVariable("id") Long id) {
        Commune commune = communeRepo.findById(id).orElseThrow(()-> new CommuneNotFoundException("commune not found"));
        return new ResponseEntity<>(commune, HttpStatus.OK);
    }

    @PostMapping("/commune")
    public ResponseEntity<Commune> addCommune(@Valid @RequestBody Commune commune) {
        Commune newCommune = communeRepo.save(commune);
        return new ResponseEntity<>(newCommune, HttpStatus.CREATED);
    }

    @PutMapping("/commune")
    public ResponseEntity<Commune> updateCommune(@Valid @RequestBody Commune commune) {
        Commune updateCommune = communeRepo.save(commune);
        return new ResponseEntity<>(updateCommune, HttpStatus.OK);
    }

    @DeleteMapping("/commune/{id}")
    public ResponseEntity<?> deleteCommune(@PathVariable("id") Long id) {
        communeRepo.deleteById(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
