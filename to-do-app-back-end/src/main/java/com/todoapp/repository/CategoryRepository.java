package com.todoapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todoapp.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findTop10ByNameContainingOrDescriptionContaining(String name, String description);

}
