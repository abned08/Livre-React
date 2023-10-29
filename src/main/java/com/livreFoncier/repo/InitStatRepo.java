package com.livreFoncier.repo;

import com.livreFoncier.model.InitStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;

public interface InitStatRepo extends JpaRepository<InitStat, Long> {

    InitStat findFirstByOrderByIdDesc();
    //// Report stats
        ///Urban
    @Query(value = "select (select  count (*) from (select distinct d.section from conservation_db.dossier d where d.locality='حضرية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanSectionNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where  d.locality='حضرية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanIlotNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where  d.locality='حضرية' and d.final_reg=true and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanIlotFinalNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.completed=true  and d.locality='حضرية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanLivrePreparedNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.record_num !=''  and d.locality='حضرية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanLivreDeliveredNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.temp_reg =true  and d.locality='حضرية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanIlotTempNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.unknown =true  and d.locality='حضرية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanIlotUnknownNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.rejected =true and d.locality='حضرية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer urbanRejectedNum(Date startDate, Date endDate);


    ///Rural
    @Query(value = "select (select  count (*) from (select distinct d.section from conservation_db.dossier d where  d.locality='ريفية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralSectionNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where  d.locality='ريفية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralIlotNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where  d.locality='ريفية' and d.final_reg=true and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralIlotFinalNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.completed=true  and d.locality='ريفية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralLivrePreparedNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.record_num !=''  and d.locality='ريفية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralLivreDeliveredNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.temp_reg =true  and d.locality='ريفية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralIlotTempNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.unknown =true  and d.locality='ريفية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralIlotUnknownNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.rejected =true and d.locality='ريفية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer ruralRejectedNum(Date startDate, Date endDate);


    ///Desert
    @Query(value = "select (select  count (*) from (select distinct d.section from conservation_db.dossier d where  d.locality='صحراوية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertSectionNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where  d.locality='صحراوية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertIlotNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where  d.locality='صحراوية' and d.final_reg=true and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertIlotFinalNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.completed=true  and d.locality='صحراوية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertLivrePreparedNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.record_num !=''  and d.locality='صحراوية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertLivreDeliveredNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.temp_reg =true  and d.locality='صحراوية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertIlotTempNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.unknown =true  and d.locality='صحراوية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertIlotUnknownNum(Date startDate, Date endDate);

    @Query(value = "select (select  count (*) from (select d.id from conservation_db.dossier d where d.rejected =true and d.locality='صحراوية' and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count)", nativeQuery = true)
    Integer desertRejectedNum(Date startDate, Date endDate);

    ///rationalization
    @Query(value = "select (select count (*) from (select d.id from conservation_db.dossier d where d.canceled =true and cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date)) as count) + (select COALESCE(sum(d.crossed_out),0) from conservation_db.dossier d where cast(d.date_depot as date) between cast(?1 as date) and cast(?2 as date))", nativeQuery = true)
    Integer crossedOutNum(Date startDate, Date endDate);

}
