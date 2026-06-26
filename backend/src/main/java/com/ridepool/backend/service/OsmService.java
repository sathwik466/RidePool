package com.ridepool.backend.service;

import com.ridepool.backend.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OsmService {

    private final RestTemplate restTemplate;

    @Value("${osrm.base-url}")
    private String osrmBaseUrl;

    public record RouteResult(double distanceKm, String polyline) {}

    @SuppressWarnings("unchecked")
    public RouteResult getRoute(double srcLat, double srcLng, double destLat, double destLng) {
        String url = String.format(
                "%s/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=polyline",
                osrmBaseUrl, srcLng, srcLat, destLng, destLat
        );

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        if (response == null) {
            throw new AppException("Failed to fetch route from OSRM");
        }

        List<Map<String, Object>> routes = (List<Map<String, Object>>) response.get("routes");
        if (routes == null || routes.isEmpty()) {
            throw new AppException("Route not found");
        }

        Map<String, Object> route = routes.get(0);
        double meters = ((Number) route.get("distance")).doubleValue();
        String polyline = (String) route.get("geometry");
        return new RouteResult(meters / 1000.0, polyline);
    }

    public static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final int earthRadiusKm = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
