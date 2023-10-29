package com.livreFoncier.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Establishment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "Wilaya cannot be empty")
    private String wilaya;
    @NotEmpty(message = "Wilaya cannot be empty")
    private String frWilaya;
    @NotEmpty(message = "Commune cannot be empty")
    private String commune;
    @NotEmpty(message = "Commune cannot be empty")
    private String frCommune;
}
