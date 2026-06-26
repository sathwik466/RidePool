package com.ridepool.backend.repository;

import com.ridepool.backend.model.SosAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {
}
