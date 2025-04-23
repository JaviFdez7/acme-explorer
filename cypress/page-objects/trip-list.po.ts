class TripList {
  typeSearchInput(value: string) {
    cy.get('input').type(value);
  }
  get trips() {
    return cy.get('app-trip-display');
  }

  tripVisible(index: number) {
    return this.trips.eq(index).should('be.visible');
  }

  tripButtonVisible(index: number) {
    return this.trips
      .eq(index)
      .find('p-button button')
      .should('be.visible');
  }

  clickButton(index: number) {
    this.trips
      .eq(index)
      .find('p-button button')
      .click();
  }

}

export default new TripList();