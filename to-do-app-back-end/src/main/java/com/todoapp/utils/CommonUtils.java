package com.todoapp.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.todoapp.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class CommonUtils {

    @Autowired
    private JwtService jwtService;

    public Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtService.extractUserId(token);
    }

    public void logOut(HttpServletRequest request) {
        jwtService.blackListToken(request.getHeader("Authorization").substring(7));
    }
}
