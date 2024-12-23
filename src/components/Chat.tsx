import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageArea } from "./messages/MessageArea";

import { useToast } from "@/hooks/use-toast";
import { Attachment, useMessages, type Message } from "@/hooks/useMessages";

export const Chat = () => {
  const { toast } = useToast();

  const { messages, addMessage, editMessage, deleteMessage, isLoading } =
    useMessages({
      storageKey: "chat-messages",
    });

  const handleSendMessage = (
    content: string,
    attachments: Attachment[],
    replyTo?: Message["replyTo"]
  ) => {
    try {
      addMessage(content, attachments, replyTo);
      toast({
        title: "Message sent",
        description: "Your message has been sent.",
      });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    try {
      editMessage({ messageId, content });
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully.",
      });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (messageId: string) => {
    try {
      deleteMessage(messageId);
      toast({
        title: "Message deleted",
        description: "Your message has been deleted successfully.",
      });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Message</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="message-area">
          <MessageArea
            messages={messages}
            onSendMessage={handleSendMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
