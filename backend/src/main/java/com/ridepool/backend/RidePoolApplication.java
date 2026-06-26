package com.ridepool.backend;
import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RidePoolApplication {

    public static void main(String[] args) {
      
       
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));


        SpringApplication.run(RidePoolApplication.class, args);
    }
}
