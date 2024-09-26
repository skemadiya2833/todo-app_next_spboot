package com.todoapp.controller;

import javax.security.auth.login.AccountNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todoapp.dto.requestdto.UpdateUserDTO;
import com.todoapp.dto.requestdto.UserDeleteDTO;
import com.todoapp.dto.responsedto.ExceptionMessage;
import com.todoapp.service.UserService;
import com.todoapp.utils.CommonUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private CommonUtils utils;

    @Autowired
    private UserService userService;

    @PutMapping
    public ResponseEntity<Object> editUser(HttpServletRequest request,
            @Valid @RequestBody UpdateUserDTO updateUserDTO) throws AccountNotFoundException {

        Long userId = utils.extractUserId(request);

        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(userId, updateUserDTO));
    }

    @PutMapping("/delete")
    public ResponseEntity<ExceptionMessage> deleteUser(HttpServletRequest request,
            @Valid @RequestBody UserDeleteDTO userDeleteDTO) throws AccountNotFoundException {

        Long userId = utils.extractUserId(request);

        userService.deleteUser(userId, userDeleteDTO);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpServletRequest request) {
        utils.logOut(request);
        return ResponseEntity.noContent().build();
    }
}
