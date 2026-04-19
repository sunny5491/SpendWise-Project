export class Budget {
  constructor(
    public id: number,
    public amount_limit: number,
    public month: string,
    public user_id: number
  ) {}

  public calculateRemaining(totalSpent: number): number {
    return this.amount_limit - totalSpent;
  }
}
