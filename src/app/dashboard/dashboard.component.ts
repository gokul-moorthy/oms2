import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OmsService } from './../_services/oms.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';

export interface Orders {
  id: number,
  dueDate: Date,
  customerName: string,
  address: String,
  phoneno: number,
  total: number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  Columns: String[] = ['orderid', 'customername', 'phoneno', 'address', 'dueDate', 'total', 'actions'];
  public data = new MatTableDataSource<Orders>();
  constructor(
    private oms: OmsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.oms.getOrder().subscribe(data => {
      // console.log(data);
      this.data.data = data as Orders[];
    }, err => {
      // console.log("Unrecognisable DATA from order fetch api");
    });
  }

  delete(order: Orders) {
    // console.log(order);
    this.oms.deleteOrder(order.id).subscribe(data => {
      this.data.data = this.data.data.filter((value, key) => {
        return value.id != order.id;
      });
      // console.log("Order deleted");
    }, err => {
      // console.log(err);
    });
  }

  view(order) {
    this.openDialog(order);
  }

  neworder(order) {
    this.openDialog(order);
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(PopupDialog, {
      width: '400px',
      data: { data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result===undefined) return;

      if (result.id) {
        var temp: any = this.data.data.map(d => {
          if (d.id === result.id)
            return result;
          else
            return d;
        });
        // console.log(temp);
        this.data.data = temp;
      } else {
        var id = 0;
        this.data.data.map(d => {
          if (d.id > id) { id = d.id; }
        });
        result.id = id + 1;
        var temp: any = this.data.data;
        temp.push(result);
        this.data.data = temp;
      }
    });
  }
}

@Component({
  selector: 'popupdiaglog',
  templateUrl: 'popupdialog.html',
})
export class PopupDialog {

  orderform: FormGroup;
  submitted: boolean = false;
  title = '';

  constructor(
    public dialogRef: MatDialogRef<PopupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private oms: OmsService,
    private fb: FormBuilder
  ) {
    data.data = data.data || {
      id: '',
      customerName: '',
      phoneno: '',
      address: '',
      total: '',
      dueDate: ''
    };
    let d = data.data || '';
    // console.log(d);
    this.orderform = this.fb.group({
      id: [d.id],
      customerName: [d.customerName, Validators.required],
      phoneno: [d.phoneno, Validators.required],
      address: [d.address, Validators.required],
      total: [d.total, Validators.required],
      dueDate: [d.dueDate, Validators.required]
    });
    this.title = data.data.id ? "Update Order" : "Create Order";
  }

  onNoClick(result): void {
    this.dialogRef.close(result);
  }

  get f() {
    return this.orderform.controls;
  }

  update() {
    if (this.validateOrder()) { return };
    // console.log(this.orderform.value);
    this.oms.updateOrder(this.orderform.value).subscribe(d => {
      this.onNoClick(this.orderform.value);
      // console.log("Updated Successfully");
    }, err => {
      // console.log("Problem in order updation", err.error);
    })
  }

  create() {
    if (this.validateOrder()) { return };
    // console.log(this.orderform.value)
    this.oms.createOrder(this.orderform.value).subscribe(d => {
      this.onNoClick(this.orderform.value);
      // console.log("Created Successfully");
    }, err => {
      // console.log("Unable to Create order", err.error);
    })
  }

  // To Validate Order Form data
  validateOrder(): boolean {
    let f: any = this.orderform.value;
    // console.log("------------------");
    // console.log(f);
    if (f.customerName != '' &&
      f.phoneno != '' && !isNaN(f.phoneno) &&
      f.address != '' &&
      f.total != '' && !isNaN(f.total) &&
      f.dueDate != '') {
      // console.log("This form is valid");
      return false;
    }
    else {
      // console.log("invalid");
      return true
    };
  }
}