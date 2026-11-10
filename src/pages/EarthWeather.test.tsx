import { beforeEach, describe, expect, it, vi } from "vitest";
import EarthWeather from "./EarthWeather";
import { render, screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

const mockedUseQuery = vi.mocked(useQuery);
describe("EarthWeather", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("displays the page heading", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useQuery>);
    render(<EarthWeather />);

    expect(
      screen.getByRole("heading", { name: "Earth Weather" }),
    ).toBeInTheDocument();
  });
});
