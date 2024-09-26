package com.todoapp.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.todoapp.entity.User;
import com.todoapp.service.JwtService;
import com.todoapp.service.UserService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    Set<String> excludedEndpoints = new HashSet<>(
            Arrays.asList("/auth/login", "/auth/signup", "/v3/api-docs", "/v3/api-docs/swagger-config"));

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI().substring(request.getContextPath().length());
        if (request.getMethod().equalsIgnoreCase("OPTIONS") || path.startsWith("/swagger-ui/")
                || excludedEndpoints.contains(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                String userEmail = jwtService.extractUsername(jwt);
                if (userEmail != null) {
                    User user = userService.loadUserByUsername(userEmail);
                    if (jwtService.isTokenValid(jwt, user)) {
                        filterChain.doFilter(request, response);
                        return;
                    }
                }
            } catch (Exception e) {
                resolver.resolveException(request, response, null, e);
                return;
            }
        }
        resolver.resolveException(request, response, null, new JwtException("Unauthorized!"));
    }
}