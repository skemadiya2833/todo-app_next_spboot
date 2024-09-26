package com.todoapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.todoapp.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM  User u WHERE u.isDeleted = false and u.email = ?1")
    Optional<User> findNotDeletedUserByEmail(String email);

    Optional<User> findByEmail(String email);
}
