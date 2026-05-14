package com.carwash.car_wash_api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final AuthenticationEntryPoint authEntryPoint;
        private final CustomAccessDeniedHandler accessDeniedHandler;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())
                                // Register custom exception handling
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(authEntryPoint)
                                                .accessDeniedHandler(accessDeniedHandler))
                                .authorizeHttpRequests(auth -> auth
                                                // 1. Public Endpoints
                                                .requestMatchers(
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html")
                                                .permitAll()
                                                .requestMatchers("/api/v1/health").permitAll()
                                                .requestMatchers("/api/v1/auth/**").permitAll()

                                                // 2. Role-Based Access Rules
                                                // Specific test routes
                                                .requestMatchers("/api/v1/test/admin-only").hasRole("ADMIN")
                                                
                                                // Admin management routes
                                                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                                                
                                                // Broad restriction: Only ADMIN can perform DELETE operations across the API
                                                .requestMatchers(HttpMethod.DELETE, "/api/v1/**").hasRole("ADMIN")

                                                // Vehicle management for both roles
                                                .requestMatchers("/api/v1/vehicles/**").hasAnyRole("CUSTOMER", "ADMIN")

                                                // Booking management
                                                // Admin / employee only: all bookings list and today's bookings
                                                .requestMatchers(HttpMethod.GET, "/api/v1/bookings/today").hasAnyRole("ADMIN", "EMPLOYEE")
                                                .requestMatchers(HttpMethod.GET, "/api/v1/bookings").hasRole("ADMIN")
                                                // Admin / employee only: status updates
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/bookings/*/status").hasAnyRole("ADMIN", "EMPLOYEE")
                                                // All other booking operations require authentication (service enforces ownership)
                                                .requestMatchers("/api/v1/bookings/**").authenticated()

                                                // Wash service management: write operations are admin-only, reads are public
                                                .requestMatchers(HttpMethod.GET, "/api/v1/services/**").permitAll()
                                                .requestMatchers("/api/v1/services/**").hasRole("ADMIN")

                                                // Profile and User-specific routes
                                                .requestMatchers("/api/v1/users/**").authenticated()
                                                .requestMatchers("/api/v1/test/secret").authenticated()

                                                // 3. Global Rule: All other requests must be authenticated
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("http://localhost:5173"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}