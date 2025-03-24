import styled from "@emotion/styled";
import ZIndex from "metabase/css/core/z-index.module.css";

export const ChatButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.active ? 'var(--color-brand)' : 'var(--color-text-medium)'};
  cursor: pointer;
  padding: 0;
  border-radius: 6px;

  &:hover {
    background: var(--color-bg-medium);
  }
`;

export const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 3;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ChatHeader = styled.div`
  padding: 16px;
  background: white;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    color: var(--color-text-medium);
    opacity: 0.8;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

export const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0055CC;
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--color-bg-light);
`;

export const Message = styled.div<{ isUser?: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: ${props => props.isUser ? "12px 12px 0 12px" : "12px 12px 12px 0"};
  align-self: ${props => (props.isUser ? "flex-end" : "flex-start")};
  background-color: white;
  color: black;
  font-size: 0.875rem;
  line-height: 1.5;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    ${props => props.isUser ? "right" : "left"}: -8px;
    width: 8px;
    height: 8px;
    background-color: white;
    clip-path: ${props =>
      props.isUser
        ? "polygon(0 0, 100% 100%, 100% 0)"
        : "polygon(0 100%, 100% 0, 0 0)"};
  }
`;

export const ChatInput = styled.div`
  padding: 16px;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 8px;
  background-color: var(--color-bg-white);
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 2px solid var(--color-border);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--color-text-dark);
  background: var(--color-bg-white);
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-brand);
  }

  &::placeholder {
    color: var(--color-text-medium);
  }

  &:disabled {
    background-color: var(--color-bg-light);
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: var(--color-brand);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-dark);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`; 