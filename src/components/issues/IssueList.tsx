import { ScrollArea } from "@/components/ui/scroll-area";
import { type Issue, ISSUE_CATEGORIES } from "@/types";

interface IssueListProps {
  issues: Issue[];
  selectedIssueId: string | null;
  onSelect: (issueId: string) => void;
  className?: string;
}

export const IssueList = ({
  issues,
  selectedIssueId,
  onSelect,
}: IssueListProps) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedIssueId === issue.id
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
            onClick={() => onSelect(issue.id)}
          >
            <div className="font-medium">{issue.title}</div>
            <div className="text-sm text-muted-foreground">
              {ISSUE_CATEGORIES[issue.category]}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(issue.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
