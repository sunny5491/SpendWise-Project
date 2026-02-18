useCaseDiagram
    actor "User" as U
    actor "System Admin" as A

    U --> (Register Account)
    U --> (Add Expense)
    U --> (Set Monthly Budget)
    U --> (View Spending Reports)
    
    A --> (Manage Users)
    A --> (System Health Check)
