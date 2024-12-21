import { Button } from "../ui/button";
import { ThumbsUp, ThumbsDown, Heart, Smile, Angry } from "lucide-react";

export interface Reaction {
  type: "like" | "dislike" | "heart" | "smile" | "angry";
  count: number;
  reacted: boolean;
}

interface MessageReactionsProps {
  reactions: Reaction[];
  onReact: (type: Reaction["type"]) => void;
}

export const MessageReactions = ({ reactions, onReact }: MessageReactionsProps) => {
  const getIcon = (type: Reaction["type"]) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4" />;
      case "dislike":
        return <ThumbsDown className="h-4 w-4" />;
      case "heart":
        return <Heart className="h-4 w-4" />;
      case "smile":
        return <Smile className="h-4 w-4" />;
      case "angry":
        return <Angry className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex gap-1 mt-1">
      {reactions.map((reaction) => (
        <Button
          key={reaction.type}
          variant="ghost"
          size="sm"
          className={`px-2 py-1 h-auto ${
            reaction.reacted ? "bg-secondary" : ""
          }`}
          onClick={() => onReact(reaction.type)}
        >
          {getIcon(reaction.type)}
          <span className="ml-1 text-xs">{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
};