package com.livreFoncier.controller;

import com.livreFoncier.exception.LivreNotFoundException;
import com.livreFoncier.model.Livre;
import com.livreFoncier.repo.LivreRepo;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@CrossOrigin@RestController
public class LivreController {
    @Data
    static class LivreCountMonth {
        String month;
        Number count;

        public LivreCountMonth(String month, Number count) {
            this.month = month;
            this.count = count;
        }
    }

    private final LivreRepo livreRepo;

    public LivreController(LivreRepo livreRepo) {
        this.livreRepo = livreRepo;
    }

    @GetMapping("/livre")
    public ResponseEntity<List<Livre>> getAllLivres () {
        List<Livre> livres = livreRepo.findAll();
        return new ResponseEntity<>(livres, HttpStatus.OK);
    }

    @PostMapping("/matchLivre")
    public ResponseEntity<Livre> getMatchLivre (@Valid @RequestBody Livre livre) {
        Livre foundLivre=livreRepo.findFirstByTownAndSectionAndIlotAndLot(livre.getTown(),livre.getSection(),livre.getIlot(),livre.getLot());
        if (foundLivre != null) {
            livre = foundLivre;
        }else {
            livre=null;
        }
        return new ResponseEntity<>(livre, HttpStatus.OK);
    }

    @PostMapping("/matchRecArngNumLivre")
    public ResponseEntity<Livre> getMatchRecArngNumLivre (@Valid @RequestBody Livre livre) {
        Livre foundLivre=livreRepo.findFirstByRecordNumAndAndArrangeNum(livre.getRecordNum(),livre.getArrangeNum());
        if (foundLivre != null) {
            livre = foundLivre;
        }else {
            livre=null;
        }
        return new ResponseEntity<>(livre, HttpStatus.OK);
    }


    @GetMapping("/lastLivre")
    public ResponseEntity<Livre> getLastLivre() {
        Livre lastL = new Livre();
        if (!isNull(livreRepo.findFirstByOrderByIdDesc())) {
            lastL= livreRepo.findFirstByOrderByIdDesc();
        } else {
            lastL.setRecordNum(0);
            lastL.setArrangeNum(0);
        }
        return new ResponseEntity<>(lastL, HttpStatus.OK);
    }

    @GetMapping("/livre/{id}")
    public ResponseEntity<Livre> getLivreById (@PathVariable("id") Long id) {
        Livre livre = livreRepo.findById(id).orElseThrow(()-> new LivreNotFoundException("livre not found"));
        return new ResponseEntity<>(livre, HttpStatus.OK);
    }

    @PostMapping("/livre")
    public ResponseEntity<Livre> addLivre(@Valid @RequestBody Livre livre) {
        Livre newLivre = livreRepo.save(livre);
        return new ResponseEntity<>(newLivre, HttpStatus.CREATED);
    }

    @PutMapping("/livre")
    public ResponseEntity<Livre> updateLivre(@Valid @RequestBody Livre livre) {
        Livre updateLivre = livreRepo.save(livre);
        return new ResponseEntity<>(updateLivre, HttpStatus.OK);
    }

    @DeleteMapping("/livre/{id}")
    public ResponseEntity<?> deleteLivre(@PathVariable("id") Long id) {
        livreRepo.deleteById(id);
        return new ResponseEntity<>(id, HttpStatus.OK);

    }

    /////// Analyzing DATA

    @GetMapping("/livre/countPerMonths")
    public ResponseEntity<List<LivreCountMonth>> getCountPerMonths() {
        List<Object[]> count = livreRepo.livreCountThisYearPerMonths();
        List<LivreCountMonth> listD = count.stream().map(x -> new LivreCountMonth(x[0].toString(), (Number) x[1])).collect(Collectors.toList());
        return new ResponseEntity<>(listD, HttpStatus.OK);
    }

    @GetMapping("/livre/totalCountThisYear")
    public ResponseEntity<Integer> getTotalCountThisYear() {
        Integer count = livreRepo.livreTotalCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/livre/doublingCountThisYear")
    public ResponseEntity<Integer> getDoublingCountThisYear() {
        Integer count = livreRepo.livreDoublingCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/livre/copyCountThisYear")
    public ResponseEntity<Integer> getCopyCountThisYear() {
        Integer count = livreRepo.livreCopyCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/livre/notDoublingNotCopyCountThisYear")
    public ResponseEntity<Integer> getNotDoublingNotCopyCountThisYear() {
        Integer count = livreRepo.livreNotDoublingNotCopyCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/livre/totalCount")
    public ResponseEntity<Integer> getTotalCount() {
        Integer count = livreRepo.livreTotalCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/livre/doublingTotalCount")
    public ResponseEntity<Integer> getDoublingTotalCount() {
        Integer count = livreRepo.livreDoublingTotalCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }


}
