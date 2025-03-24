import { useState, useRef, useEffect } from "react";
import { t } from "ttag";
import { Icon } from "metabase/ui";
import {
  ChatbotContainer,
  ChatHeader,
  ChatTitle,
  ChatMessages,
  Message,
  ChatInput,
  Input,
  SendButton,
} from "./ChatbotButton.styled";

interface ChatbotButtonProps {
  className?: string;
}

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export const ChatbotButton = ({ className }: ChatbotButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from ChatGPT");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          content: "Sorry, I encountered an error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={className}
        aria-label={t`Chat with AI`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          padding: 0,
          color: isOpen ? "var(--color-brand)" : "var(--color-text-medium)",
          background: "transparent",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        <Icon name="question" size={16} />
      </button>
      {isOpen && (
        <ChatbotContainer>
          <ChatHeader>
            <ChatTitle>{t`Galaxy Assistant`}</ChatTitle>
            <button
              onClick={handleToggle}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <Icon name="close" size={16} />
            </button>
          </ChatHeader>
          <ChatMessages>
            {messages.map((message, index) => (
              <Message key={index} isUser={message.isUser}>
                {message.content}
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInput>
            <Input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={t`Type your message...`}
              disabled={isLoading}
            />
            <SendButton onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Icon name="arrow_right" size={14} />
              {t`Send`}
            </SendButton>
          </ChatInput>
        </ChatbotContainer>
      )}
    </>
  );
}; 