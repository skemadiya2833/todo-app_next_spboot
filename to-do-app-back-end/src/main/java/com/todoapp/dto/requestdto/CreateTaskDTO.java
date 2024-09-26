package com.todoapp.dto.requestdto;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.todoapp.enums.Priority;
import com.todoapp.enums.Status;
import com.todoapp.validation.ValidDeadline;
import com.todoapp.validation.ValidReminder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ValidDeadline
@ValidReminder
public class CreateTaskDTO {

    @NotBlank(message = "Title must not be empty")
    @Size(max = 255, message = "Title must be less than or equal to 255 characters")
    private String title;

    private String description;

    private Long categoryId;

    private Priority priority;

    private Status status;

    private String thumbnail;

    @DateTimeFormat
    private LocalDateTime reminder;

    @DateTimeFormat
    @NotNull(message = "Start Datetime is Required")
    private LocalDateTime startDateTime;

    @DateTimeFormat
    @NotNull(message = "Deadline is Required")
    private LocalDateTime deadline;
}
