package com.example.api_spring_boot.steps;

import com.example.api_spring_boot.entity.Etudiant;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.jupiter.api.Assertions;

import java.time.LocalDate;

public class EtudiantSteps {

    private Etudiant etudiant;
    private int calculAge;

    @Given("un étudiant avec la date de naissance {string}")
    public void un_étudiant_avec_la_date_de_naissance(String dateStr) {
        etudiant = Etudiant.builder()
                .dateNaissance(LocalDate.parse(dateStr))
                .build();
    }

    @When("on calcule son âge")
    public void on_calcule_son_âge() {
        calculAge = etudiant.age();
    }

    @Then("l'âge retourné doit être {int}")
    public void l_âge_retourné_doit_être(Integer expectedAge) {
        Assertions.assertEquals(expectedAge, calculAge);
    }
}
