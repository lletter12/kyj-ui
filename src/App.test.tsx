import { render, screen } from "@testing-library/react";
import App from "./App";
import {expect, test} from "vitest";

test('Page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Vite + React' })).toBeDefined()
})