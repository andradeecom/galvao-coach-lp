# Test Requirements (BDD)

## Feature: Image Registration

### Scenario: Submitting correct values (Happy Path)

    - Given I am on the image registration page
    - When I enter "Cris Cookie" in the name field
    - Then I enter "cookie@email.com" in the email field
    - Then I enter "+34 123 456 789" in the email field
    - Then I click the submit button
    - Then I should see the loading spinner on button and the response form the server

### Scenario: Submitting incorrect values

    - Given I am filling contact form
    - When I enter "" in the name field
    - Then I enter "" in the email field
    - Then I enter "" in the phone field
    - Then I'm not accept the privacy field
    - Then I click the submit button
    - Then I should see "Please fill in this field" message above the title field
    - And I should see "Please type a valid URL" message above the imageUrl field
    - And I should see an exclamation icon in the title and URL fields

    ...and so on.
