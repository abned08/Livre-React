package com.livreFoncier.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class InitStat implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer urban_sectionNum;
    private Integer urban_ilotNum;
    private Integer urban_ilotNumFinal;
    private Integer urban_livrePrepared;
    private Integer urban_livreDelivered;
    private Integer urban_ilotTempNum;
    private Integer urban_ilotUnknownNum;
    private Integer urban_rejectedNum;

    private Integer rural_sectionNum;
    private Integer rural_ilotNum;
    private Integer rural_ilotNumFinal;
    private Integer rural_livrePrepared;
    private Integer rural_livreDelivered;
    private Integer rural_ilotTempNum;
    private Integer rural_ilotUnknownNum;
    private Integer rural_rejectedNum;

    private Integer desert_sectionNum;
    private Integer desert_ilotNum;
    private Integer desert_ilotNumFinal;
    private Integer desert_livrePrepared;
    private Integer desert_livreDelivered;
    private Integer desert_ilotTempNum;
    private Integer desert_ilotUnknownNum;
    private Integer desert_rejectedNum;


    private Integer crossedOutNum = 0;

    private boolean precState = false;
}
