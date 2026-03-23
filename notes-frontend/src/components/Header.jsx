import { useState, useRef } from "react";
import { NotebookPen, LogOut, Search, X } from "lucide-react";

// Repeated button style extracted once
const btnClass =
  "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95";

const IconButton = ({ onClick, label, children }) => (
  <button onClick={onClick} className={btnClass} aria-label={label}>
    {children}
  </button>
);

const SearchBar = ({ value, onChange, onClose, searchInputRef }) => (
  <div className="flex items-center gap-1.5 search-slide-in">
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        ref={searchInputRef}
        value={value}
        onChange={onChange}
        placeholder="Search notes…"
        className="w-48 sm:w-64 rounded-lg border border-input bg-background py-1.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40"
      />
    </div>
    <IconButton onClick={onClose} label="Close search">
      <X className="h-4 w-4" />
    </IconButton>
  </div>
);

const Header = ({ search, setSearch }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearch("");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <NotebookPen className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Notes</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Toggle between search input and search button */}
          {searchOpen ? (
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClose={closeSearch}
              searchInputRef={searchInputRef}
            />
          ) : (
            <IconButton onClick={openSearch} label="Open search">
              <Search className="h-4 w-4" />
            </IconButton>
          )}

          <IconButton label="Logout">
            <LogOut className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
