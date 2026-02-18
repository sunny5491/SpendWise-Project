erDiagram
    USERS ||--o{ EXPENSES : "records"
    USERS ||--o{ BUDGETS : "defines"

    USERS {
        int id PK
        string email
        string password
    }
    EXPENSES {
        int id PK
        float amount
        string category
        datetime created_at
        int user_id FK
    }
    BUDGETS {
        int id PK
        float amount_limit
        string month
        int user_id FK
    }
