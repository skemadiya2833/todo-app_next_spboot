package com.todoapp.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.todoapp.dto.responsedto.ImportResonse;
import com.todoapp.entity.Task;
import com.todoapp.entity.User;
import com.todoapp.enums.Priority;
import com.todoapp.enums.Status;

@Component
public class CsvUtility {

  public final String TYPE = "text/csv";

  public boolean hasCsvFormat(MultipartFile file) {
    return TYPE.equals(file.getContentType());
  }

  public void writeRepsonseCsv(List<Task> tasks, Writer writer) throws IOException {
    CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT);
    printer.printRecord("Title", "Description", "Priority", "Status", "StartDatetime", "Deadline", "Reminder");
    for (Task task : tasks) {
      printer.printRecord(task.getTitle(), task.getDescription(), task.getPriority(), task.getStatus(),
          task.getStartDateTime(), task.getDeadline(), task.getReminder());
    }
    printer.close();
  }

  public ImportResonse csvToTaskList(InputStream inputStream, Long userId) {
    List<Task> taskList = new ArrayList<>();
    Map<Integer, String> errorMap = new HashMap<>();

    try (
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        CSVParser csvParser = new CSVParser(bufferedReader,
            CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

      Iterable<CSVRecord> csvRecords = csvParser.getRecords();
      Map<String, Integer> headerMap = csvParser.getHeaderMap();
      if (!headerMap.containsKey("title") || !headerMap.containsKey("description")) {
        errorMap.put(0, "Title is a reuired field");
        return new ImportResonse(null, errorMap);
      }
      for (CSVRecord csvRecord : csvRecords) {
        try {
          if (csvRecord.isConsistent()) {
            taskList.add(getTaskFromCSVRecord(userId, csvRecord, headerMap));
          } else {
            errorMap.put((int) csvRecord.getRecordNumber(), "Inconsistent record");
          }
        } catch (Exception e) {
          errorMap.put((int) csvRecord.getRecordNumber(), e.getMessage());
        }
      }
    } catch (IOException e) {
      throw new RuntimeException("Failed to parse CSV data: " + e.getMessage(), e);
    }

    return new ImportResonse(taskList, errorMap);
  }

  private Task getTaskFromCSVRecord(Long userId, CSVRecord csvRecord, Map<String, Integer> headerMap) {

    Task task = new Task();

    task.setUser(new User(userId, null, null, null, null, false));
    task.setTitle(csvRecord.get(headerMap.get("title")));
    task.setDescription(csvRecord.get(headerMap.get("description")));

    if (headerMap.containsKey("priority")) {
      String priorityStr = csvRecord.get(headerMap.get("priority"));
      task.setPriority((priorityStr == null || priorityStr.isEmpty()) ? Priority.LOW
          : Priority.valueOf(priorityStr.toUpperCase()));
    }

    if (headerMap.containsKey("status")) {
      String statusStr = csvRecord.get(headerMap.get("status"));
      task.setStatus(
          (statusStr == null || statusStr.isEmpty()) ? Status.TODO : Status.valueOf(statusStr.toUpperCase()));
    }

    String startDateTimeStr = null;
    if (headerMap.containsKey("startdatetime")) {
      startDateTimeStr = csvRecord.get(headerMap.get("startdatetime"));
    }
    LocalDateTime startDateTime = (startDateTimeStr == null || startDateTimeStr.isEmpty()) ? LocalDateTime.now()
        : LocalDateTime.parse(startDateTimeStr);
    task.setStartDateTime(startDateTime);

    String deadlineStr = null;
    if (headerMap.containsKey("deadline")) {
      deadlineStr = csvRecord.get(headerMap.get("deadline"));
    }
    task.setDeadline((deadlineStr == null || deadlineStr.isEmpty()) ? startDateTime.plusWeeks(1)
        : LocalDateTime.parse(deadlineStr));

    String reminderStr = null;
    if (headerMap.containsKey("reminder")) {
      reminderStr = csvRecord.get(headerMap.get("reminder"));
    }
    task.setReminder((reminderStr == null || reminderStr.isEmpty()) ? startDateTime.plusDays(1)
        : LocalDateTime.parse(reminderStr));

    return task;
  }
}