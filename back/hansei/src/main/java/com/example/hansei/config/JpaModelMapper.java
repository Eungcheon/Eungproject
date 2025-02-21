package com.example.hansei.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JpaModelMapper {
	
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

}
