package com.livreFoncier.controller;

import com.livreFoncier.exception.StateNotFoundException;
import com.livreFoncier.model.State;
import com.livreFoncier.repo.StateRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
public class StateController {
    private final StateRepo stateRepo;

    public StateController(StateRepo stateRepo) {
        this.stateRepo = stateRepo;
    }

    @GetMapping("/state")
    public ResponseEntity<List<State>> getAllStates () {
        List<State> states = stateRepo.findAll();
        return new ResponseEntity<>(states, HttpStatus.OK);
    }

    @GetMapping("/state/{id}")
    public ResponseEntity<State> getStateById (@PathVariable("id") Long id) {
        State state = stateRepo.findById(id).orElseThrow(()-> new StateNotFoundException("state not found"));
        return new ResponseEntity<>(state, HttpStatus.OK);
    }

    @PostMapping("/state")
    public ResponseEntity<State> addState(@Valid @RequestBody State state) {
        State newState = stateRepo.save(state);
        return new ResponseEntity<>(newState, HttpStatus.CREATED);
    }

    @PutMapping("/state")
    public ResponseEntity<State> updateState(@Valid @RequestBody State state) {
        State updateState = stateRepo.save(state);
        return new ResponseEntity<>(updateState, HttpStatus.OK);
    }

    @DeleteMapping("/state/{id}")
    public ResponseEntity<?> deleteState(@PathVariable("id") Long id) {
        stateRepo.deleteById(id);
        return new ResponseEntity<>(id, HttpStatus.OK);

    }
}
