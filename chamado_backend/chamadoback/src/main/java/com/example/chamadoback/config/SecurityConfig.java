package com.example.chamadoback.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita CSRF (API REST stateless não usa sessão)
            .csrf(AbstractHttpConfigurer::disable)

            // Stateless — não cria sessão HTTP
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos de login
                .requestMatchers(HttpMethod.POST,
                    "/usuarios/login",
                    "/administradores/login"
                ).permitAll()

                // Swagger UI (documentação)
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api-docs/**"
                ).permitAll()

                // Todas as demais rotas são permitidas nesta fase
                // (substituir por .authenticated() ao implementar JWT)
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /**
     * Bean de criptografia de senha (BCrypt).
     * Deve ser usado nos services ao salvar/validar senhas — nunca armazene
     * senha em texto puro (RNF03).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
