import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

import { MessageInput } from "./MessageInput";
import { AttachmentPreview } from "./AttachmentPreview";
import { Reply } from "./Reply";
import { MessageBubble } from "./MessageBubble";
import { MessageSearch } from "./MessageSearch";
import { TypingIndicator } from "./TypingIndicator";

import { useHandleAttachment } from "@/hooks/useHandleAttachment";
import { useHandleMessageActions } from "@/hooks/useHandleMessageActions";
import { type Attachment, type Message } from "@/types";
import { groupMessagesByDate } from "@/utils/messageGrouping";

interface MessageAreaProps {
  messages: Message[];
  onSendMessage: (
    content: string,
    attachments: Attachment[],
    replyTo?: Message["replyTo"]
  ) => void;
  onEditMessage?: (messageId: string, content: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  isIssue?: boolean;
  isLoading?: boolean;
}

export const MessageArea = ({
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  isIssue,
  isLoading = false,
}: MessageAreaProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const {
    attachments,
    setAttachments,
    handleAttachment,
    removeAttachment,
    uploadProgress,
  } = useHandleAttachment();

  const {
    editingMessageId,
    message,
    messageListRef,
    replyingTo,
    handleEdit,
    handleSubmit,
    handleReply,
    scrollToMessage,
    setReplyingTo,
    setMessage,
  } = useHandleMessageActions(
    attachments,
    messages,
    onSendMessage,
    setAttachments,
    isIssue,
    onEditMessage
  );

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedMessages = groupMessagesByDate(filteredMessages);

  // Simulate typing indicator (in a real app, this would come from the server)
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingTimeout);
  }, [message]);


  // Scroll to bottom when messages are loaded or updated
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messageListRef, messages]);

  return (
    <>
      <MessageSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
      />

      <div className="message-list" ref={messageListRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            {searchQuery ? "No messages found" : "No messages yet"}
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="mb-6">
              <div className="text-center mb-4">
                <span className="px-3 py-1 bg-secondary/50 rounded-full text-sm font-medium">
                  {date}
                </span>
              </div>
              <div className="space-y-4">
                {dateMessages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onEdit={handleEdit}
                    onReply={handleReply}
                    onQuoteClick={scrollToMessage}
                    onDelete={onDeleteMessage}
                    isIssue={isIssue}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {isTyping && <TypingIndicator />}

      {replyingTo && (
        <Reply replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
      )}

      {attachments.length > 0 && (
        <>
          <AttachmentPreview
            attachments={attachments}
            removeAttachment={removeAttachment}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="px-4 py-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}

      <MessageInput
        attachments={attachments}
        message={message}
        handleAttachment={handleAttachment}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        editingMessageId={editingMessageId}
        isIssue={isIssue}
      />
    </>
  );
};
