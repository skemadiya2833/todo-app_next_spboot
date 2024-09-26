package com.todoapp.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.todoapp.entity.Task;
import com.todoapp.enums.Priority;
import com.todoapp.enums.Status;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

        @Query("SELECT t FROM Task t WHERE t.user.id = :userId")
        Page<Task> findByUserId(@Param("userId") Long userId, Pageable pageable);

        @Query("SELECT t FROM Task t WHERE t.user.id = :userId "
                        + "AND (:query IS NULL OR t.title LIKE %:query% OR t.description LIKE %:query%) "
                        + "AND (:categoryId = 0 OR t.category.id = :categoryId) "
                        + "AND (:overdues = FALSE OR (t.deadline <= :currentDateTime AND t.status != com.todoapp.enums.Status.COMPLETED)) "
                        + "AND (:startDate IS NULL OR t.deadline >= :startDate) "
                        + "AND (:endDate IS NULL OR t.deadline <= :endDate) "
                        + "AND (:priority IS NULL OR t.priority = :priority) "
                        + "AND (:status IS NULL OR t.status = :status)")
        Page<Task> findByFilters(@Param("userId") Long userId,
                        @Param("query") String query,
                        @Param("categoryId") Long categoryId,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        @Param("priority") Priority priority,
                        @Param("status") Status status,
                        @Param("overdues") Boolean overdues,
                        @Param("currentDateTime") LocalDateTime currentDateTime,
                        Pageable pageable);

        @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.status != com.todoapp.enums.Status.COMPLETED AND t.reminder > :timeNow AND t.reminder < :timeAfter2Days ORDER BY t.reminder")
        Page<Task> findUpcomingRemindersByUserId(@Param("userId") Long userId, Pageable pageable,
                        @Param("timeNow") LocalDateTime timeNow,
                        @Param("timeAfter2Days") LocalDateTime timeAfter2Days);

        @Query("SELECT COUNT(t) > 0 FROM Task t WHERE t.user.id = :userId AND ( :taskId IS NULL OR t.id != :taskId ) AND DATE_FORMAT(t.deadline, '%Y-%m-%d %H:%i:00') > DATE_FORMAT(:startDateTime, '%Y-%m-%d %H:%i:00')")
        Boolean findIfAlreadyATaskExistsByUserId(@Param("userId") Long userId, @Param("taskId") Long taskId, @Param("startDateTime") LocalDateTime startDateTime);

        List<Task> findByReminderBetween(LocalDateTime now, LocalDateTime nextHour);
                
}
