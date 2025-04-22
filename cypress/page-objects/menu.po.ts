class Menu {
  get menu() {
    return cy.get('app-navbar');
  }

  get menuItems() {
    return this.menu.find('li');
  }

  menuItemVisible(index: number) {
    return this.menuItems.eq(index).should('be.visible');
  }

  menuItemText(index: number) {
    return this.menuItems
      .eq(index)
      .find('> div.p-menubar-item-content > a.p-menubar-item-link > span')
      .invoke('text');
  }

  menuItemClick(index: number) {
    this.menuItems.eq(index).click();
  }
}

export default new Menu();