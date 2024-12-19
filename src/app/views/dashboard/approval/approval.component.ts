import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { ToastrService } from 'ngx-toastr';
import { BudgetBookingApproval, BudgetBooking, BudgetBookingLines } from '../budgetBookingClass';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [DataTablesModule],
  templateUrl: './approval.component.html',
  providers: [NgbModalConfig, NgbModal],
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private assetInputElRef: ElementRef;
  @ViewChild('assetInput') set assetInput(elRef: ElementRef) {
    this.assetInputElRef = elRef;
  }

  private datatableElement: DataTableDirective;
  dataTable: any;
  objBudgetBookingApproval: BudgetBookingApproval;
  angForm: FormGroup;
  date: { year: number, month: number };
  model: NgbDateStruct;
  minDate = {};
  objBookings: any;
  public objPoets: BudgetBooking[] = [];
  objPoetUserData: BudgetBookingLines[] = [];
  objPendingApproval = [];
  modaltitle: string;
  isBtnEnabled: boolean = true;
  type: string;
  BBFNo: string;
  seq: string;
  approvalId: string;
  message: string;
  objBudgetBookingLines: BudgetBookingLines;
  loginUserName: string = "Test@test.com";
  EMAIL_ADDRESS: string = "";
  applyHideClassForBooking: boolean = true;
  isBtnApprvEnabled: boolean = false;
  isLoader: boolean = false;
  userName: string = "";
  fileURL: string;
  public objBudgetAttachments: any = [];
  constructor(private route: ActivatedRoute, private toastr: ToastrService, private chRef: ChangeDetectorRef,
    private fb: FormBuilder, config: NgbModalConfig, private service: ApiService) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.BBFNo = params['val'];
      this.seq = params["seq"];
      this.approvalId = params["approvalId"];
    });
    this.createForm();
    this.getUserName();
    this.getApprovalDetails(this.approvalId)
  }

  // displayToConsole(datatableElement: DataTableDirective): void {
  //   datatableElement.dtInstance.then((dtInstance: DataTables.Api) => console.log(dtInstance));
  // }

  ngOnInit() {
    $("a").removeClass("liactive");
    $("a").addClass("liactive");
    this.isLoader = true;
    if (this.BBFNo != "" && this.BBFNo != undefined) {
      this.applyHideClassForBooking = false;
      this.GetData(true);
    } else {
      this.modaltitle = "Data Not Available..."
      this.applyHideClassForBooking = true;
    }
  }

  getMyPendingApprovals() {
    this.service.myPendingApproval(this.loginUserName.toLocaleLowerCase()).subscribe((res) => {
   // this.service.myPendingApproval('charles.awad@maf.ae').subscribe((res) => {
      if (res != null && res != '') {
        let pendingApproval = res as any;
        this.objPendingApproval = pendingApproval;
      }
    });
  }

  getUserName() {
    this.service.getUserName().subscribe((res) => {
      if (res != null && res != '') {
        let user = res as any;
        this.userName = user.d.Title;
        this.loginUserName = user.d.Email;
        this.getMyPendingApprovals();
      }
    });
  }

  getApprovalDetails(id:any) {
    this.service.getApprovalDetails(id).subscribe((res) => {
      if (res != null && res != '') {
        let user = res as any;
        this.EMAIL_ADDRESS = user.approvalReqFrom;
        if (user.approved == 'No') {
          if (true)
            //if (this.EMAIL_ADDRESS.toLocaleLowerCase() == this.loginUserName.toLocaleLowerCase()) 
            this.isBtnApprvEnabled = true;
          else
            this.message = "The Logged In User and the Approval User are Different";
        }
        else {
          this.message = "This action is already completed";
          this.isBtnApprvEnabled = false;
        }
      }
      else {
        this.message = "This action is already completed";
        this.isBtnApprvEnabled = false;
      }
      if (this.userName == "")
        this.message = "Your Session has been expired, please open the Approval/Reject Link from the Email";
    });
  }

  downloadFile(poet:any) {
    let attachmentId: any = { "attachementId": poet.id };
    this.service.getAttachements(attachmentId).subscribe(res => {
      let response: any = res;
      let byteCharacters = atob(response.imageData);
      let byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++)
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      let byteArray = new Uint8Array(byteNumbers);
      let file = new Blob([byteArray], { type: response.fileType });
      let windowsVariable: any;
      windowsVariable = window.navigator;
      if (windowsVariable.msSaveOrOpenBlob)
        windowsVariable.msSaveBlob(file, response.fileName);
      else {
        this.fileURL = URL.createObjectURL(file);
        var anchor = document.createElement("a");
        anchor.download = response.fileName;
        anchor.href = this.fileURL;
        anchor.click();
      }
    });
  }

  clearFileDaily() {
    var file = $("dailyfile");
    file.replaceWith(file.val('').clone(true));
  }

  bbfPendingApproval(approval:any) {
    this.isLoader = true;
    this.BBFNo = approval.bbHeaderId;
    this.approvalId = approval.approvalId;
    this.getApprovalDetails(this.approvalId)
    this.GetData(true);
  }

  saveDatatoDB(angForm: NgForm, isSubmitted: boolean) {
    this.isLoader = true;
    let checkval = true;
    if (isSubmitted == false) {
      if (angForm.value.remarks == null || angForm.value.remarks == "") {
        checkval = false;
        this.toastr.error('Failed', 'Please enter Remarks', {
          timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
        });
      }
    } if (checkval == true) {
      this.objBudgetBookingApproval = new BudgetBookingApproval;
      this.objBudgetBookingApproval.approveRejectStatus = isSubmitted;
      this.objBudgetBookingApproval.createdBy = this.loginUserName;
      this.objBudgetBookingApproval.comments = angForm.value.remarks;
      this.objBudgetBookingApproval.approvedId = Number(this.approvalId);
      this.objBudgetBookingApproval.id = Number(this.BBFNo);
      this.objBudgetBookingApproval.sequence = Number(this.seq)
      this.objBudgetBookingApproval.userName = this.loginUserName;
      this.service.budgetBookingApproveReject(this.objBudgetBookingApproval).subscribe(res => {
        let result: any;
        result = res;
        this.isBtnEnabled = false;
        if (result == true) {
          if (isSubmitted == true) {
            this.toastr.success('Success', 'Approved', {
              timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
            });
          }
          else {
            this.toastr.success('Success', 'Rejected', {
              timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
            });
          }
        }
        else {
          this.toastr.error(result, 'Error Occured', {
            timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
          });
        }
        this.getMyPendingApprovals();
        setTimeout(() => { this.isLoader = false; }, 300);
      }), (err:any) => {
        this.isBtnEnabled = true;
      }
    }
  }


  GetData(isonint: boolean) {
    this.objBudgetBookingLines = new BudgetBookingLines();
    this.objBudgetBookingLines.bbheaderId = parseInt(this.BBFNo);
    this.service.getBBbyId(this.BBFNo).subscribe((res) => {
      this.objBookings = res;
      //this.objBookings = this.objBookings.filter(l => l.id == this.BBFNo);
      this.service.getBudgetLines(this.objBudgetBookingLines).subscribe(response => {
        this.service.getCMBUser(this.objBookings.requestedBy).subscribe(cmbres => {
          let cmbUser: any = cmbres;
          let attachmentId: any = { "bbHeaderId": this.objBudgetBookingLines.bbheaderId };
          this.service.getAllAttachements(attachmentId).subscribe(downloadResponse => {
            this.objBudgetAttachments = downloadResponse;
          });
          this.objPoetUserData = response as BudgetBookingLines[];
          let totalAmount: number = 0;

          this.angForm.controls["requestedby"].setValue(cmbUser.fullName);
          this.angForm.controls["description"].setValue(this.objBookings.description);
          this.angForm.controls["justification"].setValue(this.objBookings.justification);
          this.objPoetUserData.forEach(item => {
            totalAmount += Number(item.lineAmount);
          });
          this.angForm.controls["totalAmount"].setValue(totalAmount);
          this.isBtnEnabled = true;
          setTimeout(() => { this.isLoader = false; }, 500);
        });
      });
      this.chRef.detectChanges();
    });
  }


  fnAction() {
    $('.buttons-excel').trigger('click');
  }

  public handleRefusalData(dismissMethod: string): void {
  }

  createForm() {
    this.modaltitle = 'Budget Booking Approval';
    this.angForm = this.fb.group({
      requestedby: [],
      totalAmount: [],
      description: [],
      justification: [],
      remarks: []
    });
  }
}


