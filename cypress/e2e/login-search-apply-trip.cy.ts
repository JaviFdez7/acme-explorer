import LoginPage from '../page-objects/login.po'
import Menu from '../page-objects/menu.po'
import TripList from '../page-objects/trip-list.po'
import TripDetails from '../page-objects/trip-details.po'
import Application from '../page-objects/application.po'

describe('login then search and apply trip', () => {
  it('passes', () => {
    LoginPage.navigateTo()
    cy.fixture('explorer').then((explorer) => {
      LoginPage.fillForm(explorer.email, explorer.password)
    })
    LoginPage.submit()
    cy.url().should('equal', 'http://localhost:4200/')
    Menu.menuItemVisible(2)
    Menu.menuItemText(2).then((text) => {
      expect(text.trim()).to.oneOf(['Explorer', 'Explorador'])
    })
    Menu.menuItemVisible(1)
    Menu.menuItemText(1).then((text) => {
      expect(text.trim()).to.oneOf(['Trips', 'Viajes'])
    })
    Menu.menuItemClick(1)
    cy.url().should('equal', 'http://localhost:4200/trips')
    TripList.typeSearchInput('playa')
    TripList.tripButtonVisible(0)
    TripList.clickButton(0)
    cy.url().should('contain', 'http://localhost:4200/trip/')
    TripDetails.visible()
    TripDetails.clickApply()
    // Wait for the URL to change after clicking the apply button and resolve redirections
    cy.wait(2000)
    cy.url().then((url) => {
      if (url.includes('http://localhost:4200/trip/')) {
        // The user has not already applied for the trip and is redirected to the trip application
        cy.url().should('include', 'http://localhost:4200/trip/')
        Application.visible()
        Application.addMessage('Test message')
        Application.submit()
      }

      // If the user has already applied (now or in the past) for the trip, they are redirected to the explorer page
      cy.url().should('include', 'http://localhost:4200/explorer/')
    })
  })
})