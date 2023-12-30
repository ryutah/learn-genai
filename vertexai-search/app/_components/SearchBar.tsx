"use client";

import { Search } from "@mui/icons-material";
import { IconButton, Input, InputAdornment } from "@mui/material";
import { useState } from "react";

interface SearchBarProps {
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

export default function SearchBar(props: SearchBarProps): JSX.Element {
  const [value, setValue] = useState("");
  const handleSearch = () => props.onSearch?.(value);

  return (
    <Input
      autoFocus={props.autoFocus}
      aria-label="search"
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.stopPropagation();
          handleSearch();
        }
      }}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="search button"
            edge="end"
            onClick={handleSearch}
          >
            <Search />
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
