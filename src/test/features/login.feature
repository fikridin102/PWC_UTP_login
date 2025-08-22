Feature: UTP Login

  Scenario: Successful login using CSV credentials
    Given Student access the URL given
    When Student login based on their credentials
    Then Student reached Ubooking Home Page
