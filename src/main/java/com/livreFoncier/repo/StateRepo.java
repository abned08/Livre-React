package com.livreFoncier.repo;

import com.livreFoncier.model.State;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateRepo extends JpaRepository<State,Long> {
}
