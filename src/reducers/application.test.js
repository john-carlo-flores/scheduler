import reducer from "reducers/application";

describe("Application Reducer", () => {
  it("throws an error with an unsupported type", () => {
    const type = "NOT_SUPPORTED";
    expect(() => reducer(null, { type })).toThrow(/tried to reduce with unsupported action type/i)
  });
});