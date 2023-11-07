package com.livreFoncier.repo;

import com.livreFoncier.model.Dossier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DossierRepo extends JpaRepository<Dossier, Long> {

    @Query("select d from Dossier d ")
    List<Dossier> findAllActivated();

    Dossier findFirstByCommuneAndSectionAndIlotAndLot(String commune, String section, String ilot, String lot);

    @Query("select d from Dossier d where d.recordNum = ?1 and d.arrangeNum = ?2")
    Dossier findFirstByRecordNumAndArrangeNum(String recordNum, String arrangeNum);

    @Query(value = "select * from conservation_db.dossier d where d.record_num!=''  and d.arrange_num!='' order by d.id desc limit 1", nativeQuery = true)
    Dossier lastLivreDossier();

    @Query(value = "select d.num from conservation_db.dossier d where date_part('year', d.date_depot)=date_part('year', CURRENT_DATE) order by d.id desc LIMIT 1", nativeQuery = true)
    Integer lastDossier();

    @Query(value = "SELECT to_char(d.date_depot, 'Mon-YYYY') as months, count(d.id) as count FROM conservation_db.dossier d WHERE d.date_depot > CURRENT_DATE - INTERVAL '6 months'  GROUP BY 1 ORDER BY min(d.date_depot)", nativeQuery = true)
    List<Object[]> dossierCountThisYearPerMonths();

    @Query(value = "SELECT count(d.id) FROM conservation_db.dossier d WHERE date_part('year', d.date_depot) = date_part('year', CURRENT_DATE) ", nativeQuery = true)
    Integer dossierTotalCountThisYear();

    @Query(value = "SELECT count(d.id) FROM conservation_db.dossier d WHERE date_part('year', d.date_depot) = date_part('year', CURRENT_DATE) and d.completed = true ", nativeQuery = true)
    Integer dossierCompletedCountThisYear();

    @Query(value = "SELECT count(d.id) FROM conservation_db.dossier d WHERE date_part('year', d.date_depot) = date_part('year', CURRENT_DATE) and d.completed = false ", nativeQuery = true)
    Integer dossierUncompletedCountThisYear();

    @Query(value = "SELECT count(d.id) FROM conservation_db.dossier d WHERE date_part('year', d.date_depot) = date_part('year', CURRENT_DATE) and d.rejected = true ", nativeQuery = true)
    Integer dossierRejectedCountThisYear();

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.rejected=true  ")
    Integer dossierRejectedTotalCount();

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.completed=true ")
    Integer dossierCompletedTotalCount();

    @Query(value = "SELECT count(d.id) FROM conservation_db.dossier d WHERE date_part('year', d.date_depot) = date_part('year', CURRENT_DATE) and d.num = ?", nativeQuery = true)
    Integer dossierCheckNumThisYear(String num);

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.locality='حضرية' ")
    Integer dossierUrbanTotalCount();

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.locality='ريفية' ")
    Integer dossierRuralTotalCount();

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.locality='صحراوية' ")
    Integer dossierDesertTotalCount();

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.finalReg=true ")
    Integer dossierFinalTotalCount();

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.tempReg=true ")
    Integer dossierTempTotalCount();

    @Query(value = "SELECT count(d.id) FROM Dossier d where d.unknown=true ")
    Integer dossierUnknownTotalCount();


    //// livre stats
    @Query(value = "SELECT to_char(l.delivery_date, 'Mon-YYYY') as months, count(l.id) as count FROM conservation_db.dossier l WHERE l.delivery_date > CURRENT_DATE - INTERVAL '6 months'  GROUP BY 1 ORDER BY min(l.delivery_date)",nativeQuery = true)
    List<Object[]>livreCountThisYearPerMonths();

    @Query(value = "SELECT count(l.id) FROM conservation_db.dossier l WHERE date_part('year', l.date_depot) = date_part('year', CURRENT_DATE) and l.completed = true ",nativeQuery = true)
    Integer livreTotalCountThisYear();

    @Query(value = "SELECT count(l.id) FROM conservation_db.dossier l WHERE date_part('year', l.delivery_date) = date_part('year', CURRENT_DATE) and l.record_num != '' ",nativeQuery = true)
    Integer livreDeliveredCountThisYear();

    @Query(value = "SELECT count(l.id) FROM conservation_db.dossier l WHERE date_part('year', l.delivery_date) = date_part('year', CURRENT_DATE) and l.repeate_or_copie = true ",nativeQuery = true)
    Integer livreCopyCountThisYear();

    @Query(value = "SELECT count(l.id) FROM conservation_db.dossier l WHERE date_part('year', l.date_depot) = date_part('year', CURRENT_DATE) and l.completed = true and  coalesce(l.record_num, '') = '' ",nativeQuery = true)
    Integer livreNotDeliveredCountThisYear();

    @Query(value = "SELECT count(l.id) FROM conservation_db.dossier l where l.record_num != '' ",nativeQuery = true)
    Integer livreTotalCount();

    @Query(value = "SELECT count(l.id) FROM Dossier l where l.unknown=true ")
    Integer livreDoublingTotalCount();


}
