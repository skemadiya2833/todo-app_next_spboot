package com.todoapp.validation;

import com.todoapp.dto.requestdto.CreateTaskDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ReminderBetweenValidator implements ConstraintValidator<ValidReminder, CreateTaskDTO> {

    @Override
    public boolean isValid(CreateTaskDTO task, ConstraintValidatorContext context) {
        if (task.getReminder() == null || task.getStartDateTime() == null || task.getDeadline() == null) {
            return true;
        }

        return task.getReminder().isAfter(task.getStartDateTime()) && task.getReminder().isBefore(task.getDeadline());
    }
}
