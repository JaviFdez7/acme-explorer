class TripDetails {

  visible() {
    return cy.get('app-trip-details').should('be.visible');
  }

  clickApply() {
    cy.get('app-trip-details')
      .find('p-button button').contains('Apply now')
      .click();
  }
}

export default new TripDetails();