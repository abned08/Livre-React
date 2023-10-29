package com.livreFoncier.controller;

// import com.livreFoncier.model.Commune;
import com.livreFoncier.model.Establishment;
import com.livreFoncier.repo.EstablishmentRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
// import java.util.List;

@CrossOrigin
@RestController
public class EstablishmentController {
    private final EstablishmentRepo establishmentRepo;

    public EstablishmentController(EstablishmentRepo establishmentRepo) {
        this.establishmentRepo = establishmentRepo;
    }

    @GetMapping("/establishment")
    public ResponseEntity<Establishment> getEst () {
        Establishment establishment = establishmentRepo.findTopByOrderByIdDesc();
        return new ResponseEntity<>(establishment, HttpStatus.OK);
    }

    @PostMapping("/establishment")
    public ResponseEntity<Establishment> addEst(@Valid @RequestBody Establishment establishment) {
        Establishment newEstablishment = establishmentRepo.save(establishment);
        return new ResponseEntity<>(newEstablishment, HttpStatus.CREATED);
    }
}
