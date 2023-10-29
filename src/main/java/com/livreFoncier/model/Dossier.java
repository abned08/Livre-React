package com.livreFoncier.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Dossier implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "number cannot be empty")
    private String num;
    @NotNull(message = "date cannot be empty")
    private Date dateDepot;
    @NotEmpty(message = "person name cannot be empty")
    private String personName;
    @NotEmpty(message = "commune cannot be empty")
    private String commune;
    @NotNull(message = "section cannot be empty")
    @PositiveOrZero(message = "section must be a positive number")
    @Max(message = "section max is 999", value = 999)
    private String section;
    @NotNull(message = "ilot cannot be empty")
    @PositiveOrZero(message = "ilot must be a positive number")
    @Max(message = "ilot max is 9999", value = 9999)
    private String ilot;
    //    @NotNull(message = "lot cannot be empty")
    @PositiveOrZero(message = "lot must be a positive number")
    @Max(message = "lot max is 999", value = 999)
    private String lot;
    private String locality;
    private String note;

//    @NotNull(message = "delivery date cannot be empty")
    private Date deliveryDate;
    //    @NotNull(message = "record number cannot be empty")
    @Max(message = "record number max is 9999", value = 9999)
    @Positive(message = "record number must be a positive number")
    private String recordNum;
    //    @NotNull(message = "arrange number cannot be empty")
    @Max(message = "arrange number max is 9999", value = 9999)
    @Positive(message = "arrange number must be a positive number")
    private String arrangeNum;
    //    private boolean doubling = false;
    private boolean repeateOrCopie = false;
    //    @NotEmpty(message = "delivered to cannot be empty")
    private String deliveredTo;

    private boolean completed;
    private boolean rejected;
    private String pdfFile;
    private Date lastDecisionDate;
    private boolean canceled = false;
    private String canceledNote;
    private boolean finalReg = false;
    private boolean tempReg = false;
    private boolean unknown = false;
    private Integer crossedOut=0;

    @JsonIgnore
    @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL)
    private Set<Decision> decisons;

}
