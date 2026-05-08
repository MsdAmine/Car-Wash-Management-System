package com.carwash.car_wash_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Car Wash Management API")
                        .version("1.0")
                        .description("REST API for managing car wash services, appointments, and customers.")
                        .contact(new Contact()
                                .name("Amine")
                                .email("your-email@example.com")));
    }
}