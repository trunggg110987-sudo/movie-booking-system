package com.example.moviebooking.config;

import com.example.moviebooking.security.CustomUserDetailsService;
import com.example.moviebooking.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    private static final String[] SWAGGER_WHITELIST = {
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(SWAGGER_WHITELIST).permitAll()

                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/movies", "/api/movies/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/showtimes", "/api/showtimes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cinemas", "/api/cinemas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms", "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/seats", "/api/seats/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/movies", "/api/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/movies", "/api/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/movies", "/api/movies/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/cinemas", "/api/cinemas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/cinemas", "/api/cinemas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cinemas", "/api/cinemas/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/rooms", "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms", "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms", "/api/rooms/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/seats", "/api/seats/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/seats", "/api/seats/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/seats", "/api/seats/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/showtimes", "/api/showtimes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/showtimes", "/api/showtimes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/showtimes", "/api/showtimes/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/bookings", "/api/bookings/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/tickets/**").authenticated()
                        .requestMatchers("/api/users/**").authenticated()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}