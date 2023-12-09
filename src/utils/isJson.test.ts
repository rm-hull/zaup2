import { expect, test } from "vitest";
import isJson from "./isJson";

test("should parse JSON string", () => {
  expect(isJson(`{"a": "b"}`)).toBeTruthy();
});

test("should not parse invalid JSON string", () => {
  expect(isJson(`sdfdsfds`)).toBeFalsy();
});
