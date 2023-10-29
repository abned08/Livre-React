package com.livreFoncier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;

import java.io.File;

@SpringBootApplication
public class LivreApplication extends SpringBootServletInitializer {

	public static ApplicationContext context;

	public static void main(String[] args) {
		File directory =new File("./dossierPdfs/");
		if (!directory.exists()) directory.mkdir();
		 SpringApplication.run(LivreApplication.class, args);
//		SpringApplicationBuilder builder = new SpringApplicationBuilder(LivreApplication.class);
//		builder.headless(false);
//		context = builder.run(args);
//		new MyTrayIcon();
	}

//	@Override
//	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
//		return builder.sources(LivreApplication.class);
//	}
}
