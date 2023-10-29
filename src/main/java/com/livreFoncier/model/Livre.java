package com.livreFoncier.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Livre implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "town cannot be empty")
    private String town;
    @NotNull(message = "section cannot be empty")
    @Positive(message = "section must be a positive number")
    @Max(message = "section max is 999",value = 999)
    private Integer section;
    @NotNull(message = "ilot cannot be empty")
    @Positive(message = "ilot must be a positive number")
    @Max(message = "ilot max is 9999",value = 9999)
    private Integer ilot;
//    @NotNull(message = "lot cannot be empty")
    @Positive(message = "lot must be a positive number")
    @Max(message = "lot max is 999",value = 999)
    private Integer lot;
    @NotNull(message = "delivery date cannot be empty")
    private Date deliveryDate;
    @NotNull(message = "record number cannot be empty")
    @Max(message = "record number max is 9999",value = 9999)
    @Positive(message = "record number must be a positive number")
    private Integer recordNum;
    @NotNull(message = "arrange number cannot be empty")
    @Max(message = "arrange number max is 9999",value = 9999)
    @Positive(message = "arrange number must be a positive number")
    private Integer arrangeNum;
    private boolean doubling = false;
    private boolean repeateOrCopie = false;
    @NotEmpty(message = "delivered to cannot be empty")
    private String deliveredTo;
    private String note;
    
}
