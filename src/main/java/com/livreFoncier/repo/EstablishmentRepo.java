package com.livreFoncier.repo;

import com.livreFoncier.model.Establishment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstablishmentRepo extends JpaRepository<Establishment,Long> {
    Establishment findTopByOrderByIdDesc();
}
