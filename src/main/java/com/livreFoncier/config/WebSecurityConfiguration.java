package com.livreFoncier.config;

import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().authorizeRequests()
                .antMatchers("/**").permitAll()
//                .antMatchers(HttpMethod.GET,"/livre/all").permitAll()
//                .antMatchers(HttpMethod.GET,"/livre/find/*").permitAll()
//                .antMatchers(HttpMethod.POST, "/livre/add").permitAll()
//                .antMatchers(HttpMethod.PUT,"/livre/update").permitAll()
//                .antMatchers(HttpMethod.DELETE,"/livre/delete/*").permitAll()
                .anyRequest().authenticated();
    }
}
