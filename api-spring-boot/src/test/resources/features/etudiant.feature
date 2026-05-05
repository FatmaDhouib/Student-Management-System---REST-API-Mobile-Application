Feature: Calcul de l'âge d'un étudiant

  Scenario: Étudiant né en 2002
    Given un étudiant avec la date de naissance "2002-04-07"
    When on calcule son âge
    Then l'âge retourné doit être 24
