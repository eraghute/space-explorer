import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GlobeExplorer from "./GlobeExplorer";
import { classifySunlight } from "../utils/sunlight";

vi.mock("cesium", () => {
  throw new Error("WebGL initialization failed");
});

describe("GlobeExplorer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("classifies daylight, twilight, and nighttime from solar elevation", () => {
    expect(classifySunlight(20)).toBe("daylight");
    expect(classifySunlight(-3)).toBe("twilight");
    expect(classifySunlight(-6)).toBe("twilight");
    expect(classifySunlight(-6.1)).toBe("nighttime");
  });

  it("shows a recoverable error when Cesium initialization fails", async () => {
    render(<GlobeExplorer />);

    expect(
      screen.getByRole("heading", { name: "Globe Explorer" }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("The 3D globe could not be loaded.");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
