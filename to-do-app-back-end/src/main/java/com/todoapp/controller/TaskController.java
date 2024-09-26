package com.todoapp.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.todoapp.dto.requestdto.CreateTaskDTO;
import com.todoapp.dto.responsedto.ImportResonse;
import com.todoapp.entity.Task;
import com.todoapp.enums.Priority;
import com.todoapp.enums.Status;
import com.todoapp.service.TaskService;
import com.todoapp.utils.CommonUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private CommonUtils utils;

    @GetMapping("/all")
    public ResponseEntity<Page<Task>> getUserTasks(HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") Long categoryId,
            @RequestParam(defaultValue = "") String startDate,
            @RequestParam(defaultValue = "") String endDate,
            @RequestParam(defaultValue = "") Status status,
            @RequestParam(defaultValue = "") Priority priority,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "ASC") String sortType,
            @RequestParam(defaultValue = "false") Boolean overdues) {

        Long userId = utils.extractUserId(request);
        return ResponseEntity
                .ok(taskService.getTasksByUserId(userId, query.trim(), categoryId, startDate, endDate, priority,
                        status, sort, sortType, size, page, overdues));
    }

    @GetMapping("/reminders")
    public ResponseEntity<Page<Task>> getUserReminders(HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        Long userId = utils.extractUserId(request);
        return ResponseEntity.ok(taskService.getRemindersByUserId(userId, size, page));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(HttpServletRequest request,
            @RequestBody @Valid CreateTaskDTO createTaskDTO) {

        Long userId = utils.extractUserId(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createNewTask(userId, createTaskDTO));
    }

    @PostMapping("/import")
    public ResponseEntity<ImportResonse> importTasks(HttpServletRequest request,
            @RequestParam MultipartFile file) {
        Long userId = utils.extractUserId(request);
        ImportResonse response = taskService.importCSV(file, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    public ResponseEntity<Void> exportToCSV(HttpServletRequest request,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") Long categoryId,
            @RequestParam(defaultValue = "") String startDate,
            @RequestParam(defaultValue = "") String endDate,
            @RequestParam(defaultValue = "") Status status,
            @RequestParam(defaultValue = "") Priority priority,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "ASC") String sortType,
            @RequestParam(defaultValue = "false") Boolean overdues,
            HttpServletResponse response) throws IOException {

        Long userId = utils.extractUserId(request);
        response.setContentType("text/csv");
        response.addHeader("Content-Disposition", "attachment; filename=\"tasks_P" + page + ".csv\"");
        try {
            taskService.writeCsv(userId, query.trim(), categoryId, startDate, endDate, priority,
                    status, sort, sortType, size, page, overdues, response.getWriter());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> editTask(HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody @Valid CreateTaskDTO createTaskDTO) throws NotFoundException {

        Long userId = utils.extractUserId(request);
        return ResponseEntity.status(HttpStatus.OK).body(taskService.updateTask(id, userId, createTaskDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(HttpServletRequest request,
            @PathVariable Long id) throws NotFoundException {

        Long userId = utils.extractUserId(request);
        taskService.deleteTask(id, userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
