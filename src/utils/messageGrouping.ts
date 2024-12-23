import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { type Message } from "@/types";

export const groupMessagesByDate = (messages: Message[]) => {
  const groups: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    let dateKey = "";

    if (isToday(date)) {
      dateKey = "Today";
    } else if (isYesterday(date)) {
      dateKey = "Yesterday";
    } else if (isThisWeek(date)) {
      dateKey = format(date, "EEEE"); // Day name
    } else {
      dateKey = format(date, "MM/dd/yyyy");
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  return groups;
};
