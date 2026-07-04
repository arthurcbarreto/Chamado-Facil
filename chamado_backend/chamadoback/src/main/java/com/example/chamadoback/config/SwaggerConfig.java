package com.example.chamadoback.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;


@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI chamadoFacilOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Chamado Fácil — API")
                        .description(
                            "API REST do sistema Chamado Fácil: plataforma de chamados " +
                            "de emergência médica para empresas privadas de SAMU/APH.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipe Chamado Fácil")
                                .email("contato@chamadoback.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Desenvolvimento"),
                        new Server().url("https://api.chamadoback.com").description("Produção")
                ));
    }
}
