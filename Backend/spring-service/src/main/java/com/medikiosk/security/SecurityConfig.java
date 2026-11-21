package com.medikiosk.security;

import com.medikiosk.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtFilter;
    private final AppProperties properties;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/login", "/api/v1/auth/refresh",
                                "/api/v1/auth/forgot-password", "/api/v1/api-docs/**",
                                "/api/v1/swagger-ui/**", "/api/v1/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/doctor/reset-password").permitAll()
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/doctor/**").hasRole("DOCTOR")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        java.util.List<String> origins = new java.util.ArrayList<>();
        origins.add("http://localhost:3000");
        origins.add("http://127.0.0.1:3000");
        origins.add("http://localhost:5173");
        origins.add("http://127.0.0.1:5173");

        if (properties.getCors() != null && properties.getCors().getAllowedOrigins() != null) {
            Arrays.stream(properties.getCors().getAllowedOrigins().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .forEach(origins::add);
        }

        config.setAllowedOriginPatterns(origins.stream().distinct().toList());
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
