describe('Gestion des étudiants', () => { 
  it('affiche la liste des étudiants', () => { 
    cy.visit('http://localhost:3000/etudiants'); 
    cy.get('h1').contains('Liste des Étudiants').should('be.visible'); 
  }); 

  it('navigue vers la page de création', () => { 
    cy.visit('http://localhost:3000/etudiants'); 
    cy.contains('Nouvel Étudiant').click(); 
    cy.url().should('include', '/etudiants/new');
  }); 
});
