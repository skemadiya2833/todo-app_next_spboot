package com.todoapp.validation;

import com.todoapp.dto.requestdto.CreateTaskDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DeadlineAfterValidator implements ConstraintValidator<ValidDeadline, CreateTaskDTO> {

    @Override
    public boolean isValid(CreateTaskDTO task, ConstraintValidatorContext context) {
        if (task.getDeadline() == null || task.getStartDateTime() == null) {
            return false; 
        }

        boolean isValid = task.getDeadline().isAfter(task.getStartDateTime());

        if (task.getReminder() != null) {
            isValid = isValid && task.getDeadline().isAfter(task.getReminder());
        }

        return isValid;
    }
}
