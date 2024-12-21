import { Search, SearchX } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface MessageSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export const MessageSearch = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
}: MessageSearchProps) => {
  return (
    <div className="sticky top-0 z-10 p-2 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSearch}
            className="shrink-0"
          >
            <SearchX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};