import {FaSearch} from "react-icons/fa";

interface SearchProps {
    placeholder?: string;
    onSearch?: (searchCity: string) => void;
}

export const SearchField = ({placeholder = "Search Location...", onSearch}: SearchProps) => {
    return (
        <div className="relative mb-6">
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const query = formData.get("search") as string;
                    if (query && onSearch) onSearch(query);
                }}
                className="flex items-center justify-between border-b border-white/30 pb-3 transition-colors duration-300 focus-within:border-white"
            >
                <input
                    className="w-full bg-transparent pr-4 text-base font-light text-white placeholder-white/60 outline-none transition-placeholder duration-200"
                    name="search"
                    type="text"
                    placeholder={placeholder}
                />
                <button 
                    type="submit" 
                    aria-label="Search location"
                    className="p-2 text-white/70 hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none"
                >
                    <FaSearch size={20} />
                </button>
            </form>
        </div>
    )
}