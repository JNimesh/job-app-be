Feature: User Creation

  Scenario Outline: Successfully creating a job seeker
    When I submit a request to create a job seeker with the following details
      | name       | email                 | sectorPreference |
      | <name>     | <email>               | <sectorPreference> |
    Then I should receive a <status> response and the profile should be created

    Examples:
      | name      | email                  | sectorPreference | status |
      | John Doe  | john.doe@example.com   | IT               | 201    |
      | Jane Smith| jane.smith@example.com | Marketing        | 201    |
