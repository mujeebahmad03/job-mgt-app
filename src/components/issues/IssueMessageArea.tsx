import { Button } from "@/components/ui/button";
import { type Message, type Attachment } from "@/types";
import { MessageArea } from "../messages/MessageArea";

interface IssueMessageAreaProps {
  messages: Message[];
  onSendMessage: (
    content: string,
    attachments: Attachment[],
    replyTo?: Message["replyTo"]
  ) => void;
  onEditMessage?: (messageId: string, content: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const IssueMessageArea = ({
  messages,
  onSendMessage,
  onEditMessage,
  onBack,
  showBackButton,
}: IssueMessageAreaProps) => {
  return (
    <div className="message-area">
      {showBackButton && (
        <div className="sticky top-0 z-10 p-2 bg-background/80 backdrop-blur-sm border-b">
          <Button variant="ghost" size="sm" onClick={onBack} className="w-full">
            Back to Issues
          </Button>
        </div>
      )}

      <MessageArea
        messages={messages}
        onSendMessage={onSendMessage}
        onEditMessage={onEditMessage}
        isIssue={true}
      />
    </div>
  );
};
