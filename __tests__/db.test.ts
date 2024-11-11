import {Pool} from "pg";
import {query} from "@/utils/db";

// Mock de Pool pour Jest
jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
  };
  return {Pool: jest.fn(() => mPool)};
});

describe("Database query function", () => {
  const mockPool = new Pool();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should execute a query successfully with parameters", async () => {
    const mockResponse = {rows: [{id: 1, name: "John Doe"}]};
    (mockPool.query as jest.Mock).mockResolvedValue(mockResponse);

    const sql = "SELECT * FROM users WHERE id = $1";
    const params = [1];
    const result = await query(sql, params);

    expect(mockPool.query).toHaveBeenCalledWith(sql, params);
    expect(result).toEqual(mockResponse);
  });

  it("should execute a query successfully without parameters", async () => {
    const mockResponse = {rows: [{id: 2, name: "Jane Doe"}]};
    (mockPool.query as jest.Mock).mockResolvedValue(mockResponse);

    const sql = "SELECT * FROM users";
    const result = await query(sql);

    expect(mockPool.query).toHaveBeenCalledWith(sql, undefined);
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if the query fails", async () => {
    const errorMessage = "Database error";
    (mockPool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const sql = "SELECT * FROM non_existent_table";

    await expect(query(sql)).rejects.toThrow(errorMessage);
    expect(mockPool.query).toHaveBeenCalledWith(sql, undefined);
  });
});
