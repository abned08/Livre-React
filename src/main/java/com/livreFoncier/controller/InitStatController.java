package com.livreFoncier.controller;

import com.livreFoncier.model.InitStat;
import com.livreFoncier.model.Livre;
import com.livreFoncier.repo.InitStatRepo;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@CrossOrigin
@RestController
public class InitStatController {

    private final InitStatRepo initStatRepo;

    public InitStatController(InitStatRepo initStatRepo) {
        this.initStatRepo = initStatRepo;
    }

    @GetMapping("/initStat")
    public ResponseEntity<List<InitStat>> getInitStat () {
        List<InitStat> initStats = initStatRepo.findAll();
        return new ResponseEntity<>(initStats, HttpStatus.OK);
    }

    @PostMapping("/initStat")
    public ResponseEntity<InitStat> addInitStat(@RequestBody InitStat initStat) {
        InitStat newInitStat = initStatRepo.save(initStat);
        return new ResponseEntity<>(newInitStat, HttpStatus.CREATED);
    }

    ///// Report Stats

    @GetMapping("/initStat/periodic")
    public ResponseEntity<List<InitStat>> getInitStat(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        InitStat current=new InitStat();
        InitStat previews=new InitStat();

        Date absDate=new Date(1970/01/01);
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.DATE, -1);
        Date prevStartDate = cal.getTime();


        current.setUrban_sectionNum(initStatRepo.urbanSectionNum(startDate,endDate));
        current.setUrban_ilotNum(initStatRepo.urbanIlotNum(startDate,endDate));
        current.setUrban_ilotNumFinal(initStatRepo.urbanIlotFinalNum(startDate,endDate));
        current.setUrban_ilotTempNum(initStatRepo.urbanIlotTempNum(startDate,endDate));
        current.setUrban_ilotUnknownNum(initStatRepo.urbanIlotUnknownNum(startDate,endDate));
        current.setUrban_livreDelivered(initStatRepo.urbanLivreDeliveredNum(startDate,endDate));
        current.setUrban_livrePrepared(initStatRepo.urbanLivrePreparedNum(startDate,endDate));
        current.setUrban_rejectedNum(initStatRepo.urbanRejectedNum(startDate,endDate));

        current.setRural_sectionNum(initStatRepo.ruralSectionNum(startDate,endDate));
        current.setRural_ilotNum(initStatRepo.ruralIlotNum(startDate,endDate));
        current.setRural_ilotNumFinal(initStatRepo.ruralIlotFinalNum(startDate,endDate));
        current.setRural_ilotTempNum(initStatRepo.ruralIlotTempNum(startDate,endDate));
        current.setRural_ilotUnknownNum(initStatRepo.ruralIlotUnknownNum(startDate,endDate));
        current.setRural_livreDelivered(initStatRepo.ruralLivreDeliveredNum(startDate,endDate));
        current.setRural_livrePrepared(initStatRepo.ruralLivrePreparedNum(startDate,endDate));
        current.setRural_rejectedNum(initStatRepo.ruralRejectedNum(startDate,endDate));

        current.setDesert_sectionNum(initStatRepo.desertSectionNum(startDate,endDate));
        current.setDesert_ilotNum(initStatRepo.desertIlotNum(startDate,endDate));
        current.setDesert_ilotNumFinal(initStatRepo.desertIlotFinalNum(startDate,endDate));
        current.setDesert_ilotTempNum(initStatRepo.desertIlotTempNum(startDate,endDate));
        current.setDesert_ilotUnknownNum(initStatRepo.desertIlotUnknownNum(startDate,endDate));
        current.setDesert_livreDelivered(initStatRepo.desertLivreDeliveredNum(startDate,endDate));
        current.setDesert_livrePrepared(initStatRepo.desertLivrePreparedNum(startDate,endDate));
        current.setDesert_rejectedNum(initStatRepo.desertRejectedNum(startDate,endDate));

        current.setCrossedOutNum(initStatRepo.crossedOutNum(startDate,endDate));

        InitStat i=initStatRepo.findFirstByOrderByIdDesc();

        previews.setUrban_sectionNum(initStatRepo.urbanSectionNum(absDate,prevStartDate) + i.getUrban_sectionNum());
        previews.setUrban_ilotNum(initStatRepo.urbanIlotNum(absDate,prevStartDate) + i.getUrban_ilotNum());
        previews.setUrban_ilotNumFinal(initStatRepo.urbanIlotFinalNum(absDate,prevStartDate) + i.getUrban_ilotNumFinal());
        previews.setUrban_ilotTempNum(initStatRepo.urbanIlotTempNum(absDate,prevStartDate) + i.getUrban_ilotTempNum());
        previews.setUrban_ilotUnknownNum(initStatRepo.urbanIlotUnknownNum(absDate,prevStartDate) + i.getUrban_ilotUnknownNum());
        previews.setUrban_livreDelivered(initStatRepo.urbanLivreDeliveredNum(absDate,prevStartDate) + i.getUrban_livreDelivered());
        previews.setUrban_livrePrepared(initStatRepo.urbanLivrePreparedNum(absDate,prevStartDate) + i.getUrban_livrePrepared());
        previews.setUrban_rejectedNum(initStatRepo.urbanRejectedNum(absDate,prevStartDate) + i.getUrban_rejectedNum());

        previews.setRural_sectionNum(initStatRepo.ruralSectionNum(absDate,prevStartDate) + i.getRural_sectionNum());
        previews.setRural_ilotNum(initStatRepo.ruralIlotNum(absDate,prevStartDate) + i.getRural_ilotNum());
        previews.setRural_ilotNumFinal(initStatRepo.ruralIlotFinalNum(absDate,prevStartDate) + i.getRural_ilotNumFinal());
        previews.setRural_ilotTempNum(initStatRepo.ruralIlotTempNum(absDate,prevStartDate) + i.getRural_ilotTempNum());
        previews.setRural_ilotUnknownNum(initStatRepo.ruralIlotUnknownNum(absDate,prevStartDate) + i.getRural_ilotUnknownNum());
        previews.setRural_livreDelivered(initStatRepo.ruralLivreDeliveredNum(absDate,prevStartDate) + i.getRural_livreDelivered());
        previews.setRural_livrePrepared(initStatRepo.ruralLivrePreparedNum(absDate,prevStartDate) + i.getRural_livrePrepared());
        previews.setRural_rejectedNum(initStatRepo.ruralRejectedNum(absDate,prevStartDate) + i.getRural_rejectedNum());

        previews.setDesert_sectionNum(initStatRepo.desertSectionNum(absDate,prevStartDate) + i.getDesert_sectionNum());
        previews.setDesert_ilotNum(initStatRepo.desertIlotNum(absDate,prevStartDate) + i.getDesert_ilotNum());
        previews.setDesert_ilotNumFinal(initStatRepo.desertIlotFinalNum(absDate,prevStartDate) + i.getDesert_ilotNumFinal());
        previews.setDesert_ilotTempNum(initStatRepo.desertIlotTempNum(absDate,prevStartDate) + i.getDesert_ilotTempNum());
        previews.setDesert_ilotUnknownNum(initStatRepo.desertIlotUnknownNum(absDate,prevStartDate) + i.getDesert_ilotUnknownNum());
        previews.setDesert_livreDelivered(initStatRepo.desertLivreDeliveredNum(absDate,prevStartDate) + i.getDesert_livreDelivered());
        previews.setDesert_livrePrepared(initStatRepo.desertLivrePreparedNum(absDate,prevStartDate) + i.getDesert_livrePrepared());
        previews.setDesert_rejectedNum(initStatRepo.desertRejectedNum(absDate,prevStartDate) + i.getDesert_rejectedNum());

        previews.setCrossedOutNum(initStatRepo.crossedOutNum(absDate,prevStartDate) + i.getCrossedOutNum());

        List<InitStat> result=new ArrayList<>();
        result.add(current);
        result.add(previews);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
