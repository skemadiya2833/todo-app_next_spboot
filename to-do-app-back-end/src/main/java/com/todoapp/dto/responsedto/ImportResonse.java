package com.todoapp.dto.responsedto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

import com.todoapp.entity.Task;

@Data
@AllArgsConstructor
public class ImportResonse {

    private List<Task> tasks;

    private Map<Integer, String> errors;
}
