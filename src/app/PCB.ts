export interface newPCB {
  process_Id: Number;
  status: "New" | "Ready" | "Running" | "Waitting" | "Terminate";
  arrival_Time: Number;
  execue_Time: Number;
  io_Time: Number;
  ready_Queue: 0 | 1 | 2 | 3;
  waitting_time: Number;
  io_waitting_time: Number;
}

export class PCB {
  private pcb = [];

  constructor() {}

  public pushPCB(data: newPCB): void {
    this.pcb.push(data);
  }

  public setExecuetime(index: number, queue: 1 | 2 | 3): void {
    this.setRunning(index);
    this.pcb[index].execue_Time += 1;
    this.pcb[index].ready_Queue = queue;
  }

  public setIOtime(index: number): void {
    this.pcb[index].io_Time += 1;
  }

  public setReady(index: number): void {
    this.pcb[index].status = "Ready";
  }

  private setRunning(index: number): void {
    this.pcb[index].status = "Running";
  }

  public setWaittingTime(index: number): void {
    this.pcb[index].io_Time += 1;
    this.pcb[index].status = "Waitting";
  }

  public setWaitting(index: number): void {
    this.pcb[index].status = "Waitting";
  }

  public setTerminate(index: number): void {
    this.pcb[index].status = "Terminate";
  }

  get getPCB(): any {
    return this.pcb;
  }
}
