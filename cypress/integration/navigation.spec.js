describe("Navigation", () => {
  beforeEach(() => {
    cy.request("GET", "api/debug/reset");
    cy.visit("/")
  });

  it("should navigate to Tuesday", () => {
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
});