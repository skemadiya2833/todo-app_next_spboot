package com.todoapp.service;

import java.io.IOException;
import java.io.Writer;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.todoapp.dto.requestdto.CreateTaskDTO;
import com.todoapp.dto.responsedto.ImportResonse;
import com.todoapp.entity.Category;
import com.todoapp.entity.Task;
import com.todoapp.entity.User;
import com.todoapp.enums.Priority;
import com.todoapp.enums.Status;
import com.todoapp.repository.CategoryRepository;
import com.todoapp.repository.TaskRepository;
import com.todoapp.utils.CsvUtility;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CsvUtility csvUtility;

    public Page<Task> getTasksByUserId(Long userId, String query, Long categoryId, String startDate, String endDate,
            Priority priority, Status status, String sort, String sortType, Integer size, Integer page,
            Boolean overdues) {

        Sort sorting = Sort.by(sort);
        if (sortType.equalsIgnoreCase("DESC")) {
            sorting = sorting.descending();
        }
        page = Math.max(0, page - 1);
        size = Math.max(size, 12);
        Pageable pageable = PageRequest.of(page, size, sorting);

        LocalDateTime startDT = null;
        LocalDateTime endDT = null;
        try {
            startDT = LocalDateTime.parse(startDate + "T00:00:00");
            endDT = LocalDateTime.parse(endDate + "T00:00:00");
        } catch (DateTimeParseException e) {
            System.out.println("Datetime not parseable");
        }

        return taskRepository.findByFilters(userId, query, categoryId, startDT, endDT, priority, status, overdues,
                LocalDateTime.now(), pageable);
    }

    public Page<Task> getRemindersByUserId(Long userId, Integer size, Integer page) {
        page = Math.max(0, page - 1);
        size = Math.max(size, 12);
        Pageable pageable = PageRequest.of(page, size);
        LocalDateTime timeAfter2Days = LocalDateTime.now().plus(Duration.ofDays(2));
        return taskRepository.findUpcomingRemindersByUserId(userId, pageable, LocalDateTime.now(), timeAfter2Days);
    }

    public Task createNewTask(Long userId, @Valid CreateTaskDTO dto) {
        Category category = null;
        if (dto.getCategoryId() != null && dto.getCategoryId() > 0) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }
        if (taskRepository.findIfAlreadyATaskExistsByUserId(userId, null, dto.getStartDateTime())) {
            throw new DataIntegrityViolationException("New task cannot be scheduled before ending of previous Task.");
        }
        Task newTask = new Task(null, dto.getTitle(), dto.getDescription(), category,
                new User(userId, null, null, null, null, false),
                dto.getPriority(), dto.getStatus(), dto.getStartDateTime(), dto.getDeadline(), dto.getReminder(),
                dto.getThumbnail(), null, null);
        return taskRepository.save(newTask);
    }

    public Task updateTask(Long id, Long userId, @Valid CreateTaskDTO dto) throws NotFoundException {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty() || optionalTask.get().getUser().getId() != userId) {
            throw new NotFoundException();
        }
        if (taskRepository.findIfAlreadyATaskExistsByUserId(userId, id, dto.getStartDateTime())) {
            throw new DataIntegrityViolationException("New task cannot be scheduled before ending of previous Task.");
        }
        Task task = optionalTask.get();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        Category category = null;
        if (dto.getCategoryId() != null && dto.getCategoryId() > 0) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }
        task.setCategory(category);
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        task.setThumbnail(dto.getThumbnail());
        task.setReminder(dto.getReminder());
        task.setStartDateTime(dto.getStartDateTime());
        task.setDeadline(dto.getDeadline());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id, Long userId) throws NotFoundException {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty() || optionalTask.get().getUser().getId() != userId) {
            throw new NotFoundException();
        }
        taskRepository.deleteById(id);
    }

    public ImportResonse importCSV(MultipartFile file, Long userId) {
        if (!csvUtility.hasCsvFormat(file)) {
            throw new IllegalArgumentException("Please upload a CSV file.");
        }
        try {
            ImportResonse result = csvUtility.csvToTaskList(file.getInputStream(), userId);
            List<Task> taskList = result.getTasks();
            List<Task> taskListDB = taskRepository.saveAll(taskList);
            result.setTasks(taskListDB);
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse CSV data: " + e.getMessage(), e);
        }
    }

    public void writeCsv(Long userId, String query, Long categoryId, String startDate, String endDate,
            Priority priority, Status status, String sort, String sortType, Integer size, Integer page,
            Boolean overdues, Writer writer) throws IOException {

        List<Task> tasks = getTasksByUserId(userId, query, categoryId, startDate, endDate, priority,
                status, sort, sortType, size, page, overdues).getContent();

        csvUtility.writeRepsonseCsv(tasks, writer);
    }

    @Scheduled(fixedRate = 600000)
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextHour = now.plusHours(1);

        List<Task> tasks = taskRepository.findByReminderBetween(now, nextHour);

        for (Task task : tasks) {
            if (task.getStatus() == Status.COMPLETED)
                continue;
            String content =
            "Hey " + task.getUser().getFirstName() + "!\n \n"+
            "This is your reminder to complete your task.\n" +
            "Status: " + task.getStatus().toString().replace("_", " ") + "\n" +
            "Priority: " + task.getPriority() + "\n" +
            "Start Date Time: " + getFormattedDateTime(task.getStartDateTime()) + "\n" +
            "Deadline: " + getFormattedDateTime(task.getDeadline()) + "\n" +
            "Description: " + task.getDescription();
            emailService.sendEmail(task.getUser().getEmail(), "Reminder for task: " + task.getTitle(), content);
        }
    }

    private String getFormattedDateTime(LocalDateTime ldt){
        return ldt.toLocalDate() + " " + ldt.toLocalTime().toString().substring(0,5);
    }
}
