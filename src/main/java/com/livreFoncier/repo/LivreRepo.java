package com.livreFoncier.repo;

import com.livreFoncier.model.Livre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface LivreRepo extends JpaRepository<Livre, Long> {
    //    @Query(value = "select l.* from conservation_db.livre l order by l.record_num desc , l.arrange_num desc LIMIT 1",nativeQuery = true)
    Livre findFirstByOrderByIdDesc();
    Livre findFirstByTownAndSectionAndIlotAndLot(String town, Integer section, Integer ilot, Integer lot);
    Livre findFirstByRecordNumAndAndArrangeNum(Integer recordNum, Integer arrangeNum);

    @Query(value = "SELECT to_char(l.delivery_date, 'Mon-YYYY') as months, count(l.id) as count FROM conservation_db.livre l WHERE l.delivery_date > CURRENT_DATE - INTERVAL '6 months' GROUP BY 1 ORDER BY min(l.delivery_date)",nativeQuery = true)
    List<Object[]>livreCountThisYearPerMonths();

    @Query(value = "SELECT count(l.id) FROM conservation_db.livre l WHERE date_part('year', l.delivery_date) = date_part('year', CURRENT_DATE)",nativeQuery = true)
    Integer livreTotalCountThisYear();

    @Query(value = "SELECT count(l.id) FROM conservation_db.livre l WHERE date_part('year', l.delivery_date) = date_part('year', CURRENT_DATE) and l.doubling = true",nativeQuery = true)
    Integer livreDoublingCountThisYear();

    @Query(value = "SELECT count(l.id) FROM conservation_db.livre l WHERE date_part('year', l.delivery_date) = date_part('year', CURRENT_DATE) and l.repeate_or_copie = true",nativeQuery = true)
    Integer livreCopyCountThisYear();

    @Query(value = "SELECT count(l.id) FROM conservation_db.livre l WHERE date_part('year', l.delivery_date) = date_part('year', CURRENT_DATE) and l.repeate_or_copie = false and l.doubling = false",nativeQuery = true)
    Integer livreNotDoublingNotCopyCountThisYear();

    @Query(value = "SELECT count(l.id) FROM Livre l")
    Integer livreTotalCount();

    @Query(value = "SELECT count(l.id) FROM Livre l where l.doubling=true")
    Integer livreDoublingTotalCount();
}
