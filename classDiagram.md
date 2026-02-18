classDiagram
    class User {
        +String email
        +String password
        +register()
        +login()
    }
    class Expense {
        +Double amount
        +String category
        +Date date
        +save()
        +delete()
    }
    class Budget {
        +Double monthlyLimit
        +calculateRemaining()
    }
    class ExpenseService {
        +validateAmount(amount)
        +processTransaction()
    }

    User "1" -- "many" Expense : tracks
    User "1" -- "1" Budget : sets
