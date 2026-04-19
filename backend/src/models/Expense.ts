export class Expense {
  constructor(
    public id: number,
    public amount: number,
    public category: string,
    public created_at: string,
    public user_id: number
  ) {}
}
