package com.livreFoncier.repo;

import com.livreFoncier.model.Commune;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommuneRepo extends JpaRepository<Commune,Long> {
}
