/*
 * Japanese Kana Flashcard App
 * Copyright (C) 2025  Sakan Nirattisaykul
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

vi.mock("next/link", () => {
  return {
    default: ({ children, href }) => <a href={href}>{children}</a>,
  };
});

describe("Header", () => {
  it("renders navigation links", () => {
    render(<Header activeTab="flashcards" setActiveTab={() => {}} />);
    expect(screen.getByText("ひらがな Hiragana")).toBeDefined();
    expect(screen.getByText("カタカナ Katakana")).toBeDefined();
    expect(screen.getByText("📊 Dashboard")).toBeDefined();
  });
});
