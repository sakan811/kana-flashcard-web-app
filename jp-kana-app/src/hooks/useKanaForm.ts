import { useRef } from "react";

interface UseKanaFormProps {
  onSubmit: (value: string) => Promise<unknown>;
  setInputValue: (value: string) => void;
  disabled: boolean;
}

export const useKanaForm = ({
  onSubmit,
  setInputValue,
  disabled,
}: UseKanaFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    await onSubmit(input.value);
    setInputValue("");

    // Focus the input element after submission with a small delay
    // to allow the DOM to update first
    setTimeout(() => {
      if (input) {
        input.focus();
      }
    }, 50);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return {
    inputRef,
    handleSubmit,
    handleChange,
    disabled,
  };
};
