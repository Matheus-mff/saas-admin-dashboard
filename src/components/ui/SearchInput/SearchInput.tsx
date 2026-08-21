import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, placeholder, onChange }: SearchInputProps) {
  return (
    <div className="search-control">
      <Search size={17} strokeWidth={1.8} aria-hidden="true" />

      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-control"
      />
    </div>
  );
}
