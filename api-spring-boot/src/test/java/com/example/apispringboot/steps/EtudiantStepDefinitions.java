package com.example.apispringboot.steps;

import com.example.apispringboot.model.Etudiant;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EtudiantStepDefinitions {

    private Etudiant etudiant;
    private int ageCalcule;

    @Given("un étudiant avec la date de naissance {string}")
    public void un_etudiant_avec_la_date_de_naissance(String dateNaissance) {
        etudiant = Etudiant.builder()
                .dateNaissance(LocalDate.parse(dateNaissance))
                .build();
    }

    @When("on calcule son âge")
    public void on_calcule_son_age() {
        ageCalcule = etudiant.age();
    }

    @Then("l'âge retourné doit être {int}")
    public void l_age_retourne_doit_etre(Integer ageAttendu) {
        assertEquals(ageAttendu, ageCalcule);
    }
}
