import { useRef } from "react";

interface UseKanaFormProps {
  onSubmit: (value: string) => Promise<unknown>;
  setInputValue: (value: string) => void;
  disabled: boolean;
  isProcessingAnswer?: boolean;
}

export const useKanaForm = ({
  onSubmit,
  setInputValue,
  disabled,
  isProcessingAnswer = false,
}: UseKanaFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = inputRef.current;
    if (!input || disabled || isProcessingAnswer) return;

    await onSubmit(input.value);
    setInputValue("");

    // Focus the input element after submission with a small delay
    // to allow the DOM to update first
    setTimeout(() => {
      if (input && !isProcessingAnswer) {
        input.focus();
      }
    }, 50);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isProcessingAnswer) {
      setInputValue(event.target.value);
    }
  };

  return {
    inputRef,
    handleSubmit,
    handleChange,
    disabled: disabled || isProcessingAnswer,
  };
};
