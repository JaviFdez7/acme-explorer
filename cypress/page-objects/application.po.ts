class Application {
  visible() {
    return cy.get('app-application-create').should('be.visible');
  }

  get inputs() {
    return cy.get('app-application-create').find('input');
  }

  addMessage(message: string) {
    cy.get('app-application-create').find('button.p-button-success').click();
    this.inputs.last().type(message);
  }

  submit() {
    cy.get('app-application-create').find('button[type="submit"]').click();
  }
}

export default new Application();