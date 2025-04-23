class LoginPage {
  navigateTo() {
    cy.visit('http://localhost:4200/login');
  }

  fillForm(email: string, password: string) {
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
  }

  submit() {
    cy.get('button[type="submit"]').click();
  }
}

export default new LoginPage();