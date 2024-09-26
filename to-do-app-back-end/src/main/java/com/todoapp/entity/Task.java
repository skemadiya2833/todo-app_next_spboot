package com.todoapp.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.todoapp.enums.Priority;
import com.todoapp.enums.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
		@UniqueConstraint(name = "uniqueStartDateTimeForEveryTaskPerUser", columnNames = { "startDateTime", "User" }) })
public class Task {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@ManyToOne
	@JoinColumn(name = "catergoryId")
	private Category category;

	@ManyToOne
	@JoinColumn(name = "userId")
	@JsonIgnore
	private User user;

	private Priority priority = Priority.LOW;

	private Status status = Status.TODO;

	private LocalDateTime startDateTime = LocalDateTime.now();

	private LocalDateTime deadline = startDateTime.plusDays(1);

	private LocalDateTime reminder = deadline.minusHours(2);

	@Lob()
	@Column(name = "thumbnail", columnDefinition = "LONGTEXT")
	private String thumbnail;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@PrePersist
	public void onPrePersist() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = this.createdAt;
	}

	@PreUpdate
	public void onPreUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}
