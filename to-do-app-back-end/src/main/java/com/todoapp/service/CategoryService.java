package com.todoapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todoapp.entity.Category;
import com.todoapp.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public void seedSampleData() {

        Category[] categories = new Category[5];

        categories[0] = new Category(null, "Social",
                "Tasks related to social activities like Meetups, Movie Plans etc.");
        categories[1] = new Category(null, "Work",
                "Tasks that are related to professional activities like Meetings, Projects etc.");
        categories[2] = new Category(null, "Home",
                "Tasks related to your personal works of home like Fixing your fan, Buying Groceries etc.");
        categories[3] = new Category(null, "Hobbies",
                "Tasks that belongs to your hobbies like Buying swimming goggles, repairing Punching Bag etc.");
        categories[4] = new Category(null, "Learning",
                "Tasks Related to Educational or Learning Purposes like Research on Rails, Learn DRY and COC principles etc.");

        for (Category category : categories) {
            System.out.println("Record Inserted: " + categoryRepository.save(category));
        }
    }

    public List<Category> getByNameOrDescription(String query) {
        return categoryRepository.findTop10ByNameContainingOrDescriptionContaining(query, query);
    }
}
