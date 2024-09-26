import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import { fetchCategories } from "./redux/slices/category-slice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface CategoryAutoCompleteProps {
  selected: string;
  setSelected: (key: string) => void;
  label: string;
}

export const CategoryAutoComplete: React.FC<CategoryAutoCompleteProps> = ({
  selected,
  setSelected,
  label,
}) => {
  const [query, setQuery] = useState<string>("");
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories(query));
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        dispatch(fetchCategories(query));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, dispatch]);

  const handleChange = (selectedKey: string | null) => {
    if (selectedKey) {
      const selectedCategory = categories.find(
        (category) => category.id === +selectedKey,
      );

      if (selectedCategory) {
        setSelected(selectedKey);
        setQuery(selectedCategory.name);
      }
    }
  };

  const handleInputChange = (newValue: string) => {
    setQuery(newValue);
    setSelected("");
  };

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Autocomplete
        fullWidth
        aria-label="Category"
        color="secondary"
        inputValue={query}
        label={label}
        placeholder="Select A Category"
        selectedKey={selected}
        variant="bordered"
        onInputChange={handleInputChange}
        onSelectionChange={(selectedKey) =>
          handleChange(selectedKey?.toString() || null)
        }
      >
        {categories.map((category) => (
          <AutocompleteItem
            key={category.id}
            textValue={category.name}
            value={category.id}
          >
            {category.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};
