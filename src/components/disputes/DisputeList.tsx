import { ScrollArea } from "@/components/ui/scroll-area";
import { DISPUTE_CATEGORIES, type Dispute } from "@/types";

interface DisputeListProps {
  disputes: Dispute[];
  selectedDisputeId: string | null;
  onSelect: (disputeId: string) => void;
  className?: string;
}

export const DisputeList = ({
  disputes,
  selectedDisputeId,
  onSelect,
}: DisputeListProps) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {disputes.map((dispute) => (
          <div
            key={dispute.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedDisputeId === dispute.id
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
            onClick={() => onSelect(dispute.id)}
          >
            <div className="font-medium">{dispute.title}</div>
            <div className="text-sm text-muted-foreground">
              {DISPUTE_CATEGORIES[dispute.category]}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(dispute.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
