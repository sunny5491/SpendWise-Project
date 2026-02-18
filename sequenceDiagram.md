sequenceDiagram
    participant User
    participant Frontend
    participant BackendAPI
    participant Database
    
    User->>Frontend: Enters expense ($20 for Dinner)
    Frontend->>BackendAPI: POST /api/expenses
    BackendAPI->>BackendAPI: Validate User Session
    BackendAPI->>Database: INSERT INTO expenses (amount, category)
    Database-->>BackendAPI: Success (ID: 101)
    BackendAPI-->>Frontend: 201 Created
    Frontend-->>User: Show "Expense Saved!"
