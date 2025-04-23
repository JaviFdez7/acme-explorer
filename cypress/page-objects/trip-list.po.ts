class TripList {
  clickSearch() {
    cy.get('app-trip-list').find('p-button[icon="pi pi-search"] button').click();
  }
  typeSearchInput(value: string) {
    cy.get('app-trip-list').find('input[placeholder="Search"]').type(value);
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