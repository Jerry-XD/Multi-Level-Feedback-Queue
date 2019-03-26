export class ReadyQueue {
  //--------- เวลาการทำงานของแต่ละคิว ---------
  public Q1_process: number = 3;
  public Q2_process: number = 5;
  public FCFS_process: number = 7;

  //--------- รอบการทำงานของแต่ละคิว ---------
  public q1_Round: number = 5;
  public q2_Round: number = 3;
  public fcfs_Round: number = 1;

  //--------- คิวการทำงาน ---------
  public Q1 = [];
  public Q2 = [];
  public FCFS = [];

  constructor() {}
}
