import { PCB } from "./PCB";
import { Component, OnInit } from "@angular/core";
import { ReadyQueue } from "./ReadyQueue";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public pcb = new PCB(); // คลาส PCB
  public queue = new ReadyQueue(); // คลาส Ready Queue
  //------------------------------------------
  public page: number = 1; // เลขหน้า PCB
  public cpuTime: number = 0; // เวลา CPU ทำงาน
  public interval: any = null; // สถานะการ Interval ของโปรแกรม
  public process_id: any = null; // Process ID
  public avgWaitting: number = 0;

  //--------- นับรอบการทำงานของแต่ละคิว ---------
  private q1_Round: number = 0;
  private q2_Round: number = 0;
  private fcfs_Round: number = 0;
  //--------- นับเวลาการทำงานของแต่ละคิว ---------
  private Q1_process: number = 0;
  private Q2_process: number = 0;
  private FCFS_process: number = 0;
  //------------------------------------------
  public cd = []; // IO_Queue
  public usb = []; // IO_Queue
  private intervalCD: any = null; // นับเวลา CD
  private intervalUSB: any = null; // นับเวลา USB
  //------------------------------------------
  constructor() {}

  public ngOnInit(): void {}

  public addProcess(): void {
    // ฟังก์ชั่นเพิ่ม Process ใหม่
    this.pcb.pushPCB({
      process_Id: this.pcb.getPCB.length + 1,
      status: "New",
      arrival_Time: this.cpuTime,
      execue_Time: 0,
      io_Time: 0,
      ready_Queue: 0,
      waitting_time: 0,
      io_waitting_time: 0
    });
  }

  public pushIO(process: any, type: "CD" | "USB"): void {
    // console.log(process);
    if (process.ready_Queue == 1) {
      this.queue.Q1.splice(0, 1); // ลบ Process ใน Q1
      this.Q1_process = 0; // ล้างค่าเวลาการทำงานของ Q1
      this.q1_Round += 1; // เพิ่มรอบการทำงานของ Q1
    } else if (process.ready_Queue == 2) {
      this.queue.Q2.splice(0, 1);
      this.Q2_process = 0;
      this.q2_Round += 1;
    } else if (process.ready_Queue == 3) {
      this.queue.FCFS.splice(0, 1);
      this.FCFS_process = 0;
      this.initial();
    }
    this.process_id = null; // ล้างค่าการ Process ใน CPU
    this.pcb.setWaitting(process.process_Id - 1);
    if (type == "CD") {
      this.cd.push({
        process_Id: process.process_Id,
        ready_Queue: process.ready_Queue,
        type: type,
        status: "Waitting"
      });
      if (this.intervalCD == null) {
        this.intervalCD = setInterval(() => {
          this.cd[0].status = "Running";
          this.pcb.setWaittingTime(this.cd[0].process_Id - 1);
          for (let j = 0; j < this.cd.length; j++) {
            if (this.cd[j].status == "Waitting") {
              this.pcb.getPCB[this.cd[j].process_Id - 1].io_waitting_time += 1;
            }
          }
        }, 1000);
      }
    } else if (type == "USB") {
      this.usb.push({
        process_Id: process.process_Id,
        ready_Queue: process.ready_Queue,
        type: type,
        status: "Waitting"
      });
      if (this.intervalUSB == null) {
        this.intervalUSB = setInterval(() => {
          this.usb[0].status = "Running";
          this.pcb.setWaittingTime(this.usb[0].process_Id - 1);
          for (let j = 0; j < this.usb.length; j++) {
            if (this.usb[j].status == "Waitting") {
              this.pcb.getPCB[this.usb[j].process_Id - 1].io_waitting_time += 1;
            }
          }
        }, 1000);
      }
    }
  }

  public popIO(data: any): void {
    this.pcb.setReady(data.process_Id - 1);
    if (data.type == "CD") {
      clearInterval(this.intervalCD);
      this.intervalCD = null;
      this.cd.splice(0, 1);
      if (this.intervalCD == null && this.cd.length > 0) {
        this.intervalCD = setInterval(() => {
          this.cd[0].status = "Running";
          this.pcb.setWaittingTime(this.cd[0].process_Id - 1);
          for (let j = 0; j < this.cd.length; j++) {
            if (this.cd[j].status == "Waitting") {
              this.pcb.getPCB[this.cd[j].process_Id - 1].io_waitting_time += 1;
            }
          }
        }, 1000);
      }
    } else if (data.type == "USB") {
      clearInterval(this.intervalUSB);
      this.intervalUSB = null;
      this.usb.splice(0, 1);
      if (this.intervalUSB == null && this.usb.length > 0) {
        this.intervalUSB = setInterval(() => {
          this.usb[0].status = "Running";
          this.pcb.setWaittingTime(this.usb[0].process_Id - 1);
          for (let j = 0; j < this.usb.length; j++) {
            if (this.usb[j].status == "Waitting") {
              this.pcb.getPCB[this.usb[j].process_Id - 1].io_waitting_time += 1;
            }
          }
        }, 1000);
      }
    }
    if (data.ready_Queue == 1) {
      this.queue.Q1.splice(1, 0, { process_Id: data.process_Id });
    } else if (data.ready_Queue == 2) {
      this.queue.Q2.splice(1, 0, { process_Id: data.process_Id });
    } else if (data.ready_Queue == 3) {
      this.queue.FCFS.splice(1, 0, { process_Id: data.process_Id });
    }
  }

  public setTerminate(id: number, queue: number): void {
    if (queue == 1) {
      this.queue.Q1.splice(0, 1); // ลบ Process ใน Q1
      this.Q1_process = 0; // ล้างค่าเวลาการทำงานของ Q1
      this.q1_Round += 1; // เพิ่มรอบการทำงานของ Q1
      this.process_id = null; // ล้างค่าการ Process ใน CPU
    } else if (queue == 2) {
      this.queue.Q2.splice(0, 1);
      this.Q2_process = 0;
      this.q2_Round += 1;
      this.process_id = null;
    } else if (queue == 3) {
      this.queue.FCFS.splice(0, 1);
      this.FCFS_process = 0;
      this.process_id = null;
      this.initial();
    }
    this.pcb.setTerminate(id - 1);
  }

  private initial(): void {
    // กำหนดค่าเริ่มต้นโปรแกรม
    this.q1_Round = 0;
    this.q2_Round = 0;
    this.fcfs_Round = 0;
    this.Q1_process = 0;
    this.Q2_process = 0;
    this.FCFS_process = 0;
  }

  public startProgram(): void {
    this.interval = setInterval(() => {
      let countTerminate: number = 0;
      let countWaitting: number = 0;
      for (let i = 0; i < this.pcb.getPCB.length; i++) {
        if (this.pcb.getPCB[i].status == "New") {
          // เพิ่มค่าใน Queue 1 เฉพาะสถานะ New
          this.pcb.setReady(i);
          this.queue.Q1.push({ process_Id: i + 1 });
        }
        if (this.pcb.getPCB[i].status == "Ready") {
          this.pcb.getPCB[i].waitting_time += 1;
        }
        if (this.pcb.getPCB[i].status == "Terminate") {
          countTerminate += 1;
          countWaitting += this.pcb.getPCB[i].waitting_time;
        }
      }
      this.avgWaitting = countWaitting / countTerminate;
      if (this.q1_Round < this.queue.q1_Round && this.queue.Q1.length != 0) {
        // รอบการทำงาน
        if (this.Q1_process <= this.queue.Q1_process) {
          //เวลาการทำงาน
          if (this.Q1_process == this.queue.Q1_process) {
            // ย้าย Process จาก Q1 มา Q2 ถ้าเวลา Process เท่ากัน
            this.queue.Q2.push(this.queue.Q1[0]); // เพิ่ม Process ใน Q2
            this.pcb.setReady(this.queue.Q1[0].process_Id - 1); // เปลี่ยนสถานะเป็น Ready
            this.queue.Q1.splice(0, 1); // ลบ Process ใน Q1
            this.Q1_process = 0; // ล้างค่าเวลาการทำงานของ Q1
            this.q1_Round += 1; // เพิ่มรอบการทำงานของ Q1
            this.process_id = null; // ล้างค่าการ Process ใน CPU
          } else {
            this.process_id = {
              process_Id: this.queue.Q1[0].process_Id,
              ready_Queue: 1
            }; // กำหนดค่า Process ใน CPU
            this.pcb.setExecuetime(this.queue.Q1[0].process_Id - 1, 1); // เพิ่มเวลาการ Execue
            this.Q1_process += 1; // เพิ่มค่าเวลาการทำงานของ Q1
          }
        }
      } else if (
        this.q2_Round < this.queue.q2_Round &&
        this.queue.Q2.length != 0
      ) {
        this.q1_Round = this.queue.q1_Round;
        if (this.Q2_process <= this.queue.Q2_process) {
          if (this.Q2_process == this.queue.Q2_process) {
            this.queue.FCFS.push(this.queue.Q2[0]);
            this.pcb.setReady(this.queue.Q2[0].process_Id - 1);
            this.queue.Q2.splice(0, 1);
            this.Q2_process = 0;
            this.q2_Round += 1;
            this.process_id = null;
          } else {
            this.process_id = {
              process_Id: this.queue.Q2[0].process_Id,
              ready_Queue: 2
            };
            this.pcb.setExecuetime(this.queue.Q2[0].process_Id - 1, 2);
            this.Q2_process += 1;
          }
        }
      } else if (
        this.fcfs_Round < this.queue.fcfs_Round &&
        this.queue.FCFS.length != 0
      ) {
        this.q1_Round = this.queue.q1_Round;
        this.q2_Round = this.queue.q2_Round;
        if (this.FCFS_process <= this.queue.FCFS_process) {
          if (this.FCFS_process == this.queue.FCFS_process) {
            // this.queue.FCFS.push(this.queue.FCFS[0]);
            this.pcb.setReady(this.queue.FCFS[0].process_Id - 1);
            // this.queue.FCFS.splice(0, 1);
            this.FCFS_process = 0;
            this.fcfs_Round += 1;
            this.process_id = null;
            this.initial();
          } else {
            this.process_id = {
              process_Id: this.queue.FCFS[0].process_Id,
              ready_Queue: 3
            };
            this.pcb.setExecuetime(this.queue.FCFS[0].process_Id - 1, 3);
            this.FCFS_process += 1;
          }
        }
      } else {
        this.initial();
      }

      this.cpuTime += 1; // นับเวลา CPU
    }, 1000);
  }

  public stopProgram(): void {
    window.location.reload();
  }
}
