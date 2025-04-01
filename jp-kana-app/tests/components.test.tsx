import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import jest-dom for DOM assertions
import KanaDisplay from "../src/components/kana/KanaDisplay";
import KanaInput from "../src/components/kana/KanaInput";
import MessageDisplay from "../src/components/kana/MessageDisplay";
import { KanaType } from "@/types/kana";

// Import matchers directly without re-importing expect
import matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

// Mock necessary providers
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "test-user" } },
    status: "authenticated",
  }),
}));

describe("Kana Components", () => {
  describe("KanaDisplay", () => {
    it("should display kana character", () => {
      render(
        <KanaDisplay
          currentKana={{
            kana: "あ",
            romaji: "a",
            type: KanaType.hiragana,
            weight: 1,
          }}
          isLoading={false}
          isDataInitialized={true}
        />,
      );

      expect(screen.getByText("あ")).toBeInTheDocument();
    });

    it("should show loading state", () => {
      render(
        <KanaDisplay
          currentKana={{
            kana: "",
            romaji: "",
            type: KanaType.hiragana,
            weight: 1,
          }}
          isLoading={true}
          isDataInitialized={false}
        />,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("KanaInput", () => {
    it("should handle input changes", () => {
      const handleChangeMock = vi.fn();
      const handleSubmitMock = vi.fn((e) => e.preventDefault());

      render(
        <KanaInput
          inputValue="a"
          onChange={handleChangeMock}
          onSubmit={handleSubmitMock}
          disabled={false}
          inputRef={{ current: null }}
        />,
      );

      const input = screen.getByLabelText("Enter Romaji:");
      fireEvent.change(input, { target: { value: "ka" } });
      expect(handleChangeMock).toHaveBeenCalled();

      const form = screen.getByTestId("kana-form");
      fireEvent.submit(form);
      expect(handleSubmitMock).toHaveBeenCalled();
    });

    it("should be disabled when specified", () => {
      render(
        <KanaInput
          inputValue=""
          onChange={() => {}}
          onSubmit={() => {}}
          disabled={true}
          inputRef={{ current: null }}
        />,
      );

      const input = screen.getByLabelText("Enter Romaji:");
      const button = screen.getByRole("button");

      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
    });
  });

  describe("MessageDisplay", () => {
    it("should display correct answer message", () => {
      render(
        <MessageDisplay
          message={{ correct: "Correct! 🎉", incorrect: "", error: "" }}
          hasError={false}
          onRetry={() => {}}
        />,
      );

      expect(screen.getByText("Correct! 🎉")).toBeInTheDocument();
    });

    it("should display incorrect answer message", () => {
      render(
        <MessageDisplay
          message={{
            correct: "",
            incorrect: "Incorrect. The correct answer was: a",
            error: "",
          }}
          hasError={false}
          onRetry={() => {}}
        />,
      );

      expect(
        screen.getByText("Incorrect. The correct answer was: a"),
      ).toBeInTheDocument();
    });

    it("should display error message with retry button", () => {
      const retryMock = vi.fn();

      render(
        <MessageDisplay
          message={{
            correct: "",
            incorrect: "",
            error: "Database connection error",
          }}
          hasError={true}
          onRetry={retryMock}
        />,
      );

      expect(screen.getByText("Database connection error")).toBeInTheDocument();
      const retryButton = screen.getByRole("button", { name: /retry/i });
      fireEvent.click(retryButton);
      expect(retryMock).toHaveBeenCalled();
    });
  });
});
