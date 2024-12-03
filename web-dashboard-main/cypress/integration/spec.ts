// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

interface User {
  email: string;
  password: string;
}

export default describe('CRA', () => {

  beforeEach(() => {
    cy.fixture('users.json').as('users')
    cy.visit('/login')
  })

  it('Login with admin user', () => {
    cy.get('@users').then((users: any) => {
      cy.get('#emailForm')
        .should('be.visible')
        .and('have.attr', 'type', 'email')
        .type(users.admin.email)
      cy.get('#passwordForm').should('be.visible')
        .and('have.attr', 'type', 'password')
        .type(users.admin.password)
      cy.get('.login__container__card__body__form__flex-button-row__button')
        .should('be.visible')
        .click()
      cy.wait(1000)
      cy.url().should('include','/purchases')
    })
  })

  it('Login with user role user', () => {
    cy.get('@users').then((users: any) => {
      cy.get('#emailForm')
        .should('be.visible')
        .and('have.attr', 'type', 'email')
        .type(users.user.email)
      cy.get('#passwordForm').should('be.visible')
        .and('have.attr', 'type', 'password')
        .type(users.user.password)
      cy.get('.login__container__card__body__form__flex-button-row__button')
        .should('be.visible')
        .click()
      cy.wait(1000)
      cy.get('.sweet-alert')
        .should('be.visible')
        .find('h2')
        .should('have.text', 'Credenciales inválidas')
        .get('.btn')
        .click()
    })
  })


  /* 
  * It is posible to iterate in an array of users
  * The code below does it.
   */

  /*   it('Users login', function () {
      cy.get('@users').each((user: User, index) => {
        cy.visit('/login')
        cy.get('#emailForm')
          .should('be.visible')
          .and('have.attr', 'type', 'email')
          .type(user.email)
        cy.get('#passwordForm')
          .should('be.visible')
          .and('have.attr', 'type', 'password')
          .type(user.password)
        cy.get('.login__container__card__body__form__flex-button-row__button')
          .should('be.visible')
          .click()
        cy.wait(1000)
      })
    }); */
})