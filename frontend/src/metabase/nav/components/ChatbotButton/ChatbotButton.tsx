import React, { useState, useRef, useEffect } from "react";
import { Icon } from "metabase/ui";
import styles from "./ChatbotButton.module.css";

interface Message {
  content: string;
  isUser: boolean;
  timestamp?: string;
  isTyping?: boolean;
  displayedContent?: string;
}

interface ChatbotButtonProps {
  className?: string;
}

export const ChatbotButton = ({ className }: ChatbotButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current.parentElement!;
      setIsUserScrolling(scrollTop + clientHeight < scrollHeight);
    }
  };

  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { content: userMessage, isUser: true, timestamp: new Date().toLocaleTimeString() }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/v1/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from assistant");
      }

      const data = await response.json();
      const assistantMessage = { 
        content: data.response, 
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        isTyping: true,
        displayedContent: ""
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Type out the message character by character
      let currentIndex = 0;
      const typeMessage = () => {
        if (currentIndex < data.response.length) {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.displayedContent = data.response.substring(0, currentIndex + 1);
            return newMessages;
          });
          currentIndex++;
          setTimeout(typeMessage, 50);
        } else {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.isTyping = false;
            lastMessage.displayedContent = undefined;
            return newMessages;
          });
          setIsLoading(false);
          // Focus input after assistant message is complete
          inputRef.current?.focus();
        }
      };
      
      typeMessage();
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          content: "Sorry, I couldn't connect to the assistant. Please try again later.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString()
        },
      ]);
      setIsLoading(false);
      // Focus input after error message
      inputRef.current?.focus();
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
        className={`${styles.chatButton} ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <Icon name="question" size={24} />
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h2 className={styles.chatTitle}>Galaxy Assistant</h2>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className={styles.messagesContainer} onScroll={handleScroll}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.isUser ? styles.userMessage : styles.assistantMessage
                } ${message.isTyping ? styles.typing : ''}`}
              >
                <span>{message.isTyping ? message.displayedContent : message.content}</span>
                {message.timestamp && (
                  <div className={styles.messageTime}>{message.timestamp}</div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.loadingSpinner} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "Type your message..." : "Type your message..."}
              className={styles.input}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <Icon name="chevronright" size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 