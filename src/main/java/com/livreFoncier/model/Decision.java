package com.livreFoncier.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Decision implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull(message = "decision number cannot be empty")
    @Positive(message = "decision number must be a positive number")
    private Integer dscNum;
    @NotEmpty(message = "decision case cannot be empty")
    private String dscCase;
    @NotNull(message = "decision date cannot be empty")
    private Date dscDate;
//    private Date dNow=new Date();

    @ManyToOne(cascade = {CascadeType.REFRESH})
    @JoinColumn
    private Dossier dossier;
}
