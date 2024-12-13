import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal, NgbDateStruct, NgbCalendar, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../api.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Select2OptionData } from 'ng-select2';
import { BudgetBookingApproval, BudgetBooking, L2Approval, BudgetBookingLines, BudgetPoetNumber, BudgetAmount } from '../budgetBookingClass';
import { CurrencyRate } from '../budgetBookingClass';

import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { PoetClass } from '../PoetClass';
import { PendingApproval } from '../PendingApproval';
import { PendingApprovalBB } from '../PendingApprovalBB';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { User, cmbUser } from '../../theme/Users';
import { UpdatePOAmount, AddPOAmount, UpdateChange } from '../masterPoetClass';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { AccordionModule } from '@coreui/angular';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SweetAlert2LoaderService, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { HighchartsChartModule } from 'highcharts-angular';
import { JwtInterceptor } from '../../_helpers';
import Swal from 'sweetalert2';
// import 'datatables.net';
// import 'datatables.net-buttons';
declare const $:any;
@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [DecimalPipe,AccordionModule,
    TabsModule,SweetAlert2Module,NgSelectModule,ReactiveFormsModule,
    HighchartsChartModule,CommonModule,FormsModule,NgbModule ],
  templateUrl: './admin-approval.component.html',
  styleUrl: './admin-approval.component.scss',
  providers:[ApiService,ToastrService,NgbModalConfig, NgbModal, {provide:SweetAlert2LoaderService,useClass:SweetAlert2LoaderService } ],
})

export class AdminApprovalComponent {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private assetInputElRef: ElementRef;
  @ViewChild('assetInput') set assetInput(elRef: ElementRef) {
    this.assetInputElRef = elRef;
  }
  dataTable: any;
  objBudgetBookingApproval: BudgetBookingApproval;
  objcmbUser: cmbUser;
  objL2Approval: L2Approval;
  DummyPoets: BudgetBooking[];
  angForm: FormGroup;
  userForm: FormGroup;
  poAdjustmentsForm: FormGroup;
  addPOForm: FormGroup;
  yearForm: FormGroup;
  years = [2021, 2020, 2019];
  date: { year: number, month: number };
  model: NgbDateStruct;
  minDate = {};
  objBookings: any;
  FCdesc: string;
  objUsers: any;
  objCurrency: any;
  objCurrencyRate: CurrencyRate;
  public objPoets: BudgetBooking[] = [];
  public objUsersList: cmbUser[] = [];
  public objAccPoets: PoetClass[] = [];
  objBudgetBookingLines: BudgetBookingLines;
  public objPoetUserData: BudgetBookingLines[] = [];
  public objAccPendingApproval: PendingApproval[] = [];
  public objPendingApprovalBB: PendingApprovalBB[] = [];
  public dataPendingApproval: Array<Select2OptionData>;
  public dataPendingBBApproval: Array<Select2OptionData>;
  public dataPOETNumber: Array<Select2OptionData>;
  public dataProjects: Array<Select2OptionData>;
  objFCategories: any;
  isSuperAdmin: boolean;
  fileURL: string;
  modaltitle: string;
  public objBudgetAttachments: any = [];
  isBtnEnabled: boolean = true;
  poetMasterID: number;
  userMasterID: number;
  poetMasterpersonID: number;

  type: string;
  val: string;
  seq: string;
  approvalId: string;

  loginUserName: string = "Test@test.com";
  EMAIL_ADDRESS: string = "";
  applyHideClassForBooking: boolean = true;
  isBtnApprvEnabled: boolean = false;
  isLoader: boolean = false;
  searchYear: FormGroup;
  budgetBookingLines: BudgetBookingLines;
  bookingMasterID: number;
  poetUserID: number;

  editFlag: boolean = false;
  addFlag: boolean = false;
  travelPoet: boolean = false;
  bbLineId: number;
  isBrowser: boolean;
  public dataYear: Array<Select2OptionData>;
  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private router: Router, 
    private frmbuilder: FormBuilder, 
    private toastr: ToastrService, 
    private chRef: ChangeDetectorRef, 
    private fb: FormBuilder, 
    config: NgbModalConfig, 
    private spinner: NgxSpinnerService, 
    private modalService: NgbModal, 
    private calendar: NgbCalendar, 
    private service:ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let items:any = [];
    items.push({ id: '2019', text: '2019' });
    items.push({ id: '2020', text: '2020' });
    items.push({ id: '2021', text: '2021' });
    items.push({ id: '2022', text: '2022' });
    items.push({ id: '2023', text: '2023' });
    items.push({ id: '2024', text: '2024' })
    this.dataYear = items;
    this.isBrowser = isPlatformBrowser(this.platformId);
    config.backdrop = 'static';
    config.keyboard = false;
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.val = params['val'];
      this.seq = params["seq"];
      this.approvalId = params["approvalId"];
    });
    
    this.createForm();
  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    
      import('jquery').then(($) => {
        // jQuery is now available for use in the browser
       // //console.log('jQuery loaded in the browser');
      });
      
     
    }
    if (typeof window !== 'undefined') {
      // Browser-specific code
      (window as any).jQuery = $;
      (window as any).$ = $;
    }
   // $("a").removeClass("liactive");
    //$(".liAdminApproval").addClass("liactive");
    this.searchYear = this.fb.group({year: ['2024'] });
    this.searchYear.controls["year"].setValue("2024");
    this.modaltitle = "BBF Admin Approval";
    this.getUserName();
    this.getPendingBBF();
    this.GetUserData(true);
    
  }

  fnVisible() {

  }

  GetUserData(flag: boolean) {
    this.isLoader = true;
    this.service.getcmbUsers().subscribe((res) => {
      this.objUsersList = res as cmbUser[];
      this.chRef.detectChanges();
      if (flag) {
        $('#userMaster thead tr').clone(true).appendTo('#userMaster thead');
        let ele=$('#userMaster thead tr:eq(0) th') as JQuery<HTMLElement>;
        ele.each(function (i:any) {
          if (i != 0) {
            var title = $(this).text();
            if (title == "Edit") {
              $(this).html('');
            }
            else {
              $(this).html('<input type="text" placeholder="Search ' + title + '" />');
              $('input', this).on('keyup change',  (event:any) => {
                if (table.column(i).search() !== event.target.value) {
                  table
                    .column(i)
                    .search(event.target.value)
                    .draw();
                }
              });
            }
          }
        });
      }
      let table =
        $('#userMaster').DataTable({
          "dom": 'Blfrtip',
          pageLength: 100,
          destroy: true,
          "paging": false,
          order: [[0, "desc"]],
          buttons: [
            {
              extend: 'excelHtml5',
              className: "btn hide",
              titleAttr: 'Export in Excel',
              text: 'Excel',
              init: function (api:any, node:any, config:any) {
                $(node).removeClass('btn-default')
              }
            }]
        });
      setTimeout(() => { this.isLoader = false; }, 500);
    });
  }

  getPendingBBF() {
    this.service.getPendingApproval().subscribe((res) => {
      this.objAccPendingApproval = res as PendingApproval[];
      let other: { id: any; text: any }[] = [];
      this.objAccPendingApproval
        .map(item => {
          return {
            id: item.BB_HEADER_ID,
            text: item.BB_HEADER_ID
          };
        }).forEach(item => other.push(item));
      this.dataPendingApproval = other;
    });
  }

  getUserName() {
    //this.service.getUserName().subscribe((res) => {
      // if (res != null && res != '') {
      //   let user = res as any;
        this.loginUserName ='veerender.kumar-e@maf.ae';// user.d.Email;
      //}
      //this.service.getEmployee(this.loginUserName).subscribe((res) => {
       // if (res != null && res != '') {
         // let users = res as any;
         // const c: any = users.d.results[0] as [];
          let user_role = 'Super Admin'; //c.Role;
          if (user_role != null && user_role.length > 0) {
            if (user_role == 'Super Admin') {
              this.isSuperAdmin = true;
              this.GetBBData(true, this.searchYear.controls["year"].value);
              this.GetPoetData(this.searchYear.controls["year"].value);
            }
            else
              this.router.navigateByUrl("/dashboard/Booking");
          }
       // }
     // });
   // });
  }

  public changedbbfNumber(e: any): void {
    this.isLoader = true;
    this.service.getBBbyId(e.value).subscribe((response:any) => {
      this.isBtnApprvEnabled = true;
      this.objBudgetBookingLines = new BudgetBookingLines();
      this.objBudgetBookingLines.bbheaderId = parseInt(e.value);
      this.service.getBBPendingApproval(this.objBudgetBookingLines.bbheaderId).subscribe(pendingResponse => {
        this.objPendingApprovalBB = pendingResponse as PendingApprovalBB[];
        let other: { id: any; text: any }[] = [];
        this.objPendingApprovalBB
          .map(item => {
            return {
              id: item.APPROVAL_ID,
              text: item.KNOWN_NAME
            };
          }).forEach(item => other.push(item));
        this.dataPendingBBApproval = other;
      });
      let attachmentId : any = { "bbHeaderId" : this.objBudgetBookingLines.bbheaderId};
      this.service.getAllAttachements(attachmentId).subscribe(downloadResponse => {
        this.objBudgetAttachments = downloadResponse;
      });
      this.service.getBudgetLines(this.objBudgetBookingLines).subscribe(res => {
        this.objPoetUserData = res as BudgetBookingLines[];
        let totalAmount: number = 0;
        this.angForm.controls["requestedby"].setValue(response[0].KNOWN_NAME);
        this.angForm.controls["description"].setValue(response[0].description);
        this.angForm.controls["justification"].setValue(response[0].justification);
        this.angForm.controls["remarks"].setValue("actioned by " + this.loginUserName.toLowerCase());
        this.objPoetUserData.forEach(item => {
          totalAmount += Number(item.lineAmount);
        });
        this.angForm.controls["totalAmount"].setValue(totalAmount);
        setTimeout(() => { this.isLoader = false; }, 500);
      });
    });
  }

  clearFileDaily() {
    var file = $("dailyfile");
    file.replaceWith(file.val('').clone(true));
  }

  open(content:any) {
    this.createUserForm();
    this.modalService.open(content, { size: 'lg', centered: true });
  }


  editUser(item:any, content:any) {
    this.createUserForm();
    this.modaltitle = 'Update CBU User Data';
    this.userMasterID = item.userID;
    this.poetMasterpersonID = item.personID;
    this.userForm.controls['fullName'].setValue(item.fullName);
    this.userForm.controls['knownName'].setValue(item.knownName);
    this.userForm.controls['manager'].setValue(item.manager);
    this.userForm.controls['emailAddress'].setValue(item.emailAddress);
    this.userForm.controls['mgrEmail'].setValue(item.mgrEmail);
    this.userForm.controls['teamName'].setValue(item.teamName);
    this.userForm.controls['userName'].setValue(item.userName);
    this.modalService.open(content, { size: 'lg', centered: true });
  }


  createUserForm() {
    this.modaltitle = 'Create New CBU User';
    this.poetMasterID = 0;
    this.poetMasterpersonID = 0;
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      knownName: ['', Validators.required],
      userName: ['', Validators.required],
      manager: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      mgrEmail: ['', [Validators.required, Validators.email]],
      teamName: ['', Validators.required]
    });

  }

  downloadFile(poet:any) {
    let attachmentId : any = { "attachementId" : poet.id };
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

  isDisabled() {
    let ret = true;
    if (this.angForm.value.approverID > 0)
      ret = false;
    return ret;
  }

  saveData(userForm: any) {
    let isvalidpoet = false;
    if (this.userMasterID > 0) {
      isvalidpoet = true;
    }
    if (isvalidpoet) {
      this.GetCMBUserObject(userForm);
      this.saveDataCMBUser(this.objcmbUser);
    }
    else {
      this.toastr.error('User Name already exists', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    }
  }

  GetCMBUserObject(userForm: NgForm): cmbUser {
    this.objcmbUser = new cmbUser
    this.objcmbUser.createdBy = this.loginUserName;
    this.objcmbUser.lastUpdateBy = this.loginUserName;
    this.objcmbUser.fullName = userForm.value.fullName;
    this.objcmbUser.knownName = userForm.value.knownName;
    this.objcmbUser.userID = userForm.value.userID;
    this.objcmbUser.userName = userForm.value.userName;
    this.objcmbUser.manager = userForm.value.manager;
    this.objcmbUser.emailAddress = userForm.value.emailAddress;
    this.objcmbUser.mgrEmail = userForm.value.mgrEmail;
    this.objcmbUser.teamName = userForm.value.teamName;
    if (this.userMasterID > 0)
      this.objcmbUser.userID = this.userMasterID;
    else
      this.objcmbUser.userID = 0;

    if (this.poetMasterpersonID > 0)
      this.objcmbUser.personID = this.poetMasterpersonID;
    else
      this.objcmbUser.personID = 0;

    return this.objcmbUser;
  }

  saveDataCMBUser(cmbUser: cmbUser) {
    this.service.savecmbUsers(cmbUser).subscribe(res => {
      let result: any;
      result = res;
      if (result.flag == true) {
        this.toastr.success('Success', 'Saved data', {
          timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
        });
        const table: any = $('#poetMaster').DataTable();
        table.destroy();
        this.chRef.detectChanges();
        this.modalService.dismissAll();
        this.userForm.reset();
      }
      else {
        this.toastr.error(result, 'Error Occured', {
          timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
        });
      }
    });
  }


  saveDataAction(angForm: any, isSubmitted: boolean) {
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
      this.objL2Approval = new L2Approval;
      this.objBudgetBookingApproval.approveRejectStatus = isSubmitted;
      this.objBudgetBookingApproval.createdBy = this.loginUserName;
      this.objBudgetBookingApproval.comments = angForm.value.remarks;
      this.objBudgetBookingApproval.approvedId = Number(this.angForm.value.approverID);
      this.objBudgetBookingApproval.id = Number(this.angForm.value.bbHeaderID);
      this.objBudgetBookingApproval.sequence = Number('2')
      this.objBudgetBookingApproval.userName = this.loginUserName;
      this.objL2Approval.approvalId = Number(this.angForm.value.approverID);
      if (isSubmitted)
        this.objL2Approval.actionType = 'Approved';
      else
        this.objL2Approval.actionType = 'Rejected';

      this.objL2Approval.bbHeaderId = Number(this.angForm.value.bbHeaderID);
      this.objL2Approval.actionBy = this.loginUserName.toLowerCase();

      this.service.budgetBookingApproveReject(this.objBudgetBookingApproval).subscribe(res => {
        this.isLoader = true;
        let result: any;
        result = res;
        if (result == true) {
          this.getPendingBBF();
          this.service.L2BookingApproveReject(this.objL2Approval).subscribe(response => {
            this.isBtnApprvEnabled = false;
            this.createForm();
          });
          this.isBtnEnabled = false;
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
          this.isLoader = false;
        }
        else {
          this.toastr.error(result, 'Error Occured', {
            timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
          });
          this.isLoader = false;
        }
      });
    }
  }

  fnAction() {
    $('.buttons-excel').trigger('click');
  }

  public handleRefusalData(dismissMethod: Event): void {
  }

  createForm() {
    this.modaltitle = 'Budget Booking Approval';
    this.angForm = this.fb.group({
      remarks: [],
      totalAmount: [],
      description: [],
      justification: [],
      bbHeaderID: [],
      requestedby: [],
      approverID: [],
    });
  }

  GetBBData(isonint: boolean, year: string) {
    this.isLoader = true;
    this.service.getBudgetbyUser(this.loginUserName, this.isSuperAdmin, year).subscribe(res => {
      if (isonint) {
        this.objPoets = res as BudgetBooking[];
        this.objPoets = this.objPoets.filter(l => l.bbStatus == "PR Created");
        this.chRef.detectChanges();
        $("#tblbooking thead tr").clone(true).appendTo("#tblbooking thead");
        let ele1=$("#tblbooking thead tr:eq(1) th") as JQuery<HTMLElement>;
        ele1.each(function (i:any) {
          var title = $(this).text();
          if (i == 0 || i == 1 || i == 2 || i == 4 || i == 5 || i == 6) {
            $(this).html(
              '<input type="text" class=""  style="width: 120px;" placeholder="' +
              title +
              '" />'
            );
          } else if (i == 3) {
            $(this).html(
              '<input type="text" class=""  style="width: 150px;" placeholder="' +
              title +
              '" />'
            );
          } else if (i == 7 || i == 8 || i == 9) {
            $(this).html(' ');
          } else {
            $(this).html(
              '<input type="text" class=""  style="width: 150px;" placeholder="' +
              title +
              '" />'
            );
          }
        });
      }
      else {
        const tableElement = $('#tblbooking');
    if ($.fn.DataTable.isDataTable(tableElement)) {
      tableElement.DataTable().destroy();
    }
        // const tblbooking: any = $("#tblbooking").DataTable();
        // tblbooking.destroy();
        this.objPoets = [];
        this.chRef.detectChanges();
        this.objPoets = res as BudgetBooking[];
        this.objPoets = this.objPoets.filter(l => l.bbStatus == "PR Created");
        console.log(this.objPoets);
        this.chRef.detectChanges();
      }
      let ele=$("#tblbooking thead tr:eq(0) th") as JQuery<HTMLElement>;
      ele.each(function (i:any) {
        $("input", this).on("keyup change",  (event:any)=> {
          if (table.column(i).search() !== event.target.value) {
            table.column(i).search(event.target.value).draw();
          }
        });
      });
      this.chRef.detectChanges(); 
      const table = $("#tblbooking").DataTable({
        dom: "Blfrtip",
        destroy: true,
        pageLength: 100,
        paging: false,
        order: [[0, "desc"]],
        buttons: [
          {
            extend: "excelHtml5",
            className: "btn hide",
            titleAttr: "Export in Excel",
            text: "Excel",
            init: function (api:any, node:any, config:any) {
              $(node).removeClass("btn-default");
            }
          }
        ],
        columnDefs: [
          { width: "10px", targets: 0 },
          { width: "40px", targets: 1 },
          { width: "100px", targets: 2 },
          { width: "70px", targets: 3 },
          { width: "70px", targets: 4 },
          { width: "70px", targets: 5 }
        ]
        // initComplete: function (this: AdminApprovalComponent) {
        //   this.initColumnSearch(table); // Pass the initialized table
        // }.bind(this)
        // initComplete: function () {
        //   this.api()
        //     .columns()
        //     .every( ()=> {
        //       var column = this;
        //       var select = $('<select><option value=""></option></select>')
        //         .appendTo($(column.footer()).empty())
        //         .on("change",  (event:any)=> {
        //           var val = $.fn.dataTable.util.escapeRegex($(event.target).val());
        //           column.search(val ? "^" + val + "$" : "", true, false).draw();
        //         });
        //       column.data().unique().sort().each(function (d:any, j:any) {
        //         select.append('<option value="' + d + '">' + d + "</option>");
        //       });
        //     });
        // }
      })
       this.isLoader = false;
    });
    this.chRef.detectChanges();
  }

  private initColumnSearch(table: any): void {
    table.columns().every((index: number) => {
      const column = table.column(index);
      const footer = $(column.footer());
      if (footer.length) {
        const select = $('<select><option value=""></option></select>')
          .appendTo(footer.empty())
          .on('change', (event: any) => {
            const val = $.fn.dataTable.util.escapeRegex($(event.target).val());
            column.search(val ? `^${val}$` : '', true, false).draw();
          });
        column.data().unique().sort().each((d: any) => {
          select.append(`<option value="${d}">${d}</option>`);
        });
      }
    });
  }
  changedYear(e: any): void {
    this.isLoader = true;
    // const table: any = $("#tblbooking").DataTable();
    // table.destroy();
    // this.chRef.detectChanges();
    this.GetBBData(false, e.text);
    this.GetPoetData(e.text);
  }

  splitPO(item:any, content:any) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  reducePO(poet:any, content:any) {
    this.bookingMasterID = poet.id;
    this.clearPOAdjustmentsForm();
    this.addPoLineClear();
    this.getPoetUserLinesData(poet);
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  changeYear(item:any, content:any) {
    alert("hh");
    this.yearForm = this.fb.group({
      year: ["", Validators.required],
      remarks: [""]
    });
    this.poetMasterID = item.id;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  UpdateChangeYear() {
    if (this.yearForm.value.year == null || this.yearForm.value.year == "")
      this.toastr.error('Plesae Select Year', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    else if (this.yearForm.value.remarks == null || this.yearForm.value.remarks == "")
      this.toastr.error('Plesae Enter Remarks', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    else {
      let objUpdateChange: UpdateChange = new UpdateChange();
      objUpdateChange.bbHeaderId = this.poetMasterID;
      objUpdateChange.creadtedBy = this.loginUserName;
      objUpdateChange.remarks = this.yearForm.value.remarks;
      objUpdateChange.updatedBy = this.loginUserName;
      objUpdateChange.updatedDate = "31-Jan-" + this.yearForm.value.year;
      this.service.updateDate(objUpdateChange).subscribe((res) => {
        this.toastr.success('Success', 'Updated the Year', {
          timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
        });
        setTimeout(() => {
          this.GetBBData(false, this.searchYear.controls["year"].value);        
          this.isLoader = false;
          this.modalService.dismissAll();
        }, 1000);
      });

    }
  }

  changedProject(e: any): void {
    this.addPOForm.controls["projectName"].setValue(e.text);
    this.FCdesc = e.text;

    let objLevel1:any = [];
    objLevel1 = this.objAccPoets.filter(
      l => l.projectName == this.addPOForm.value.projectName
    );
    if (e.text == 'Travel CMO' || e.text == 'Travel Loyalty' || e.text == 'Travel Marketing' || e.text == 'Travel Communication' || e.text == 'Travel Brand') {
      this.travelPoet = true;
      this.addPOForm.controls["unitPrice"].setValue(1)
    }
    else {
      this.travelPoet = false;
      //this.poAdjustmentsForm.controls["unitPrice"].setValue(0)
    }
    if (objLevel1 != null && objLevel1.length > 0) {
      this.addPOForm.controls["poetNumber"].setValue(objLevel1[0].poetNumber);
      let poetNumber = new BudgetPoetNumber();
      poetNumber.poetNumber = objLevel1[0].poetNumber;
      poetNumber.year = this.searchYear.controls["year"].value;
      this.getBudgetAmount(poetNumber);
    }
    this.addFlag = true;
  }

  changedPoet(e: any): void {
    this.addPOForm.controls["poetNumber"].setValue(e.text);
    let poetNumber = new BudgetPoetNumber();
    poetNumber.poetNumber = e.text;
    poetNumber.year = this.searchYear.controls["year"].value;
    this.getBudgetAmount(poetNumber);

    this.FCdesc = e.text;
    let objLevel1:any = [];
    objLevel1 = this.objAccPoets.filter(
      l => l.poetNumber == this.addPOForm.value.poetNumber
    );

    if (e.text == '80.01' || e.text == '80.02' || e.text == '80.03' || e.text == '80.04' || e.text == '80.05') {
      this.travelPoet = true;
      this.addPOForm.controls["unitPrice"].setValue(1)
    }
    else {
      this.travelPoet = false;
      //this.poAdjustmentsForm.controls["unitPrice"].setValue(0)
    }

    if (objLevel1 != null && objLevel1.length > 0) {
      this.addPOForm.controls["projectName"].setValue(
        objLevel1[0].projectName
      );
    }
    this.addFlag = true;
  }

  clearPOAdjustmentsForm() {
    this.editFlag = false;
    this.addFlag = false;
    this.poAdjustmentsForm = this.fb.group({
      poetNumber: ["", Validators.required],
      projectName: ["", Validators.required],
      HoldingPercentage: [0],
      VenturesPercentage: [0],
      PropertiesPercentage: [0],
      RetailPercentage: [0],
      OtherPercentage: [0],
      allocatedBudget: [],
      availableActual: [],
      updateAmount: [0],
      actualAmount: [0],
      availableBudget: [],
      remarks: [],
      currency: [],
      rate: [],
      unitPrice: [],
      qty: []
    });
  }


  GetPoetData(year: string) {
    this.service.getPoet(year, this.loginUserName.toLowerCase()).subscribe(res => {
      this.objAccPoets = res as PoetClass[];
      let other:any = [];
      let projects:any = [];
      this.objAccPoets.map(item => { return { id: item.poetNumber, text: item.poetNumber }; }).forEach(item => other.push(item));
      this.dataPOETNumber = other;
      this.objAccPoets.map(item => { return { id: item.projectName, text: item.projectName }; }).forEach(item => projects.push(item));
      this.dataProjects = projects;
    });
  }

  getBudgetAmount(BudgetPoetNumber: BudgetPoetNumber) {
    this.service.getBudgetAmount(BudgetPoetNumber).subscribe(res => {
      let objPoets = res as BudgetAmount[];
      this.poAdjustmentsForm.controls["availableActual"].setValue(objPoets[0].availableActual);
      this.poAdjustmentsForm.controls["allocatedBudget"].setValue(objPoets[0].fullBudget);
      this.poAdjustmentsForm.controls["availableBudget"].setValue(objPoets[0].yearlyBudget);
      this.poAdjustmentsForm.controls["HoldingPercentage"].setValue(objPoets[0].holdingPercentage);
      this.poAdjustmentsForm.controls["PropertiesPercentage"].setValue(objPoets[0].propertiesPercentage);
      this.poAdjustmentsForm.controls["RetailPercentage"].setValue(objPoets[0].retailPercentage);
      this.poAdjustmentsForm.controls["VenturesPercentage"].setValue(objPoets[0].venturesPercentage);
      this.poAdjustmentsForm.controls["OtherPercentage"].setValue(objPoets[0].othersPercentage);

      this.addPOForm.controls["availableActual"].setValue(objPoets[0].availableActual);
      this.addPOForm.controls["allocatedBudget"].setValue(objPoets[0].fullBudget);
      this.addPOForm.controls["availableBudget"].setValue(objPoets[0].yearlyBudget);
      this.addPOForm.controls["HoldingPercentage"].setValue(objPoets[0].holdingPercentage);
      this.addPOForm.controls["PropertiesPercentage"].setValue(objPoets[0].propertiesPercentage);
      this.addPOForm.controls["RetailPercentage"].setValue(objPoets[0].retailPercentage);
      this.addPOForm.controls["VenturesPercentage"].setValue(objPoets[0].venturesPercentage);
      this.addPOForm.controls["OtherPercentage"].setValue(objPoets[0].othersPercentage);
    });
  }

  getBudgetPercentageAmount(BudgetPoetNumber: BudgetPoetNumber) {
    this.service.getBudgetAmount(BudgetPoetNumber).subscribe(res => {
      let objPoets = res as BudgetAmount[];
      this.poAdjustmentsForm.controls["HoldingPercentage"].setValue(
        objPoets[0].holdingPercentage
      );
      this.poAdjustmentsForm.controls["PropertiesPercentage"].setValue(
        objPoets[0].propertiesPercentage
      );
      this.poAdjustmentsForm.controls["RetailPercentage"].setValue(
        objPoets[0].retailPercentage
      );
      this.poAdjustmentsForm.controls["VenturesPercentage"].setValue(
        objPoets[0].venturesPercentage
      );
      this.poAdjustmentsForm.controls["OtherPercentage"].setValue(
        objPoets[0].othersPercentage
      );
    });
  }

  getPoetUserLinesData(poet:any) {
    this.clearPOAdjustmentsForm();
    this.budgetBookingLines = new BudgetBookingLines();
    this.budgetBookingLines.bbheaderId = this.bookingMasterID;
    this.service.getBudgetLines(this.budgetBookingLines).subscribe(res => {
      this.objPoetUserData = res as BudgetBookingLines[];
      this.poAdjustmentsForm.controls["currency"].setValue(poet.currency);
      this.poAdjustmentsForm.controls["rate"].setValue(poet.exchangeRate);
      this.addPOForm.controls["currency"].setValue(poet.currency);
      this.addPOForm.controls["rate"].setValue(poet.exchangeRate);
    });
  }

  editBookingLines(poetLines:any) {
    this.poAdjustmentsForm.controls["projectName"].setValue(poetLines.projectName);
    this.poAdjustmentsForm.controls["poetNumber"].setValue(poetLines.poetNumber);
    let actualAmount = 0;

    if (poetLines.PO_AMOUNT > 0)
      actualAmount = poetLines.PO_AMOUNT;
    else if (poetLines.PR_AMOUNT)
      actualAmount = poetLines.PR_AMOUNT;
    else if (poetLines.BBF_AMOUNT)
      actualAmount = poetLines.BBF_AMOUNT;

    this.editFlag = true;
    this.poAdjustmentsForm.controls["actualAmount"].setValue(actualAmount);
    this.poAdjustmentsForm.controls["unitPrice"].setValue(poetLines.unitPrice);
    this.poAdjustmentsForm.controls["qty"].setValue(poetLines.quantity);
    let poetNumber = new BudgetPoetNumber();
    poetNumber.poetNumber = poetLines.poetNumber;
    this.bbLineId = poetLines.id;
    poetNumber.year = this.searchYear.controls["year"].value;
    this.getBudgetAmount(poetNumber);
  }


  saveUpdatePOAmount() {
    if (this.poAdjustmentsForm.value.remarks == null)
      this.toastr.error('Plesae Enter Remarks', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    else {
      this.isLoader = true;
      let objUpdatePOAmount: UpdatePOAmount = new UpdatePOAmount();
      objUpdatePOAmount.bbLineId = this.bbLineId;
      objUpdatePOAmount.remarks = this.poAdjustmentsForm.value.remarks;
      objUpdatePOAmount.updateAmount = this.poAdjustmentsForm.value.updateAmount;
      objUpdatePOAmount.creadtedBy = this.loginUserName;
      objUpdatePOAmount.updatedBy = this.loginUserName;
      this.modalService.dismissAll();
      this.service.updatePOAmount(objUpdatePOAmount).subscribe((res) => {
        this.toastr.success('Success', 'Updated the PO Value', {
          timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
        });
        setTimeout(() => {
          this.isLoader = false;
        }, 1000);
      });
    }
  }

  addPoLineClear() {
    this.addFlag = false;
    this.addPOForm = this.fb.group({
      poetNumber: ["", Validators.required],
      projectName: ["", Validators.required],
      HoldingPercentage: [0],
      VenturesPercentage: [0],
      PropertiesPercentage: [0],
      RetailPercentage: [0],
      OtherPercentage: [0],
      allocatedBudget: [],
      availableActual: [],
      updateAmount: [0],
      actualAmount: [0],
      availableBudget: [],
      remarks: [],
      currency: [],
      rate: [],
      unitPrice: [],
      qty: [],
      spendAmount: []
    });
  }

  onChangeCalAmount() {
    let UP = Number(this.addPOForm.value.unitPrice);
    let Q = Number(this.addPOForm.value.qty);
    let r = Number(this.addPOForm.value.rate);
    let total = UP * Q * r;
    this.addPOForm.controls["spendAmount"].setValue(total);
    let AvailableActual = Number(this.addPOForm.value.availableActual);

    //if (total > AvailableActual && !this.addPOForm.value.dummyPoetCheck) {
    if (total > AvailableActual) {
      this.toastr.error("Total amount cannot be exceeds Available Budget",
        "Error Occured", { timeOut: 9000, progressBar: true, progressAnimation: "decreasing", easeTime: 300 });
      this.addPOForm.controls["unitPrice"].setValue("0");
      this.addPOForm.controls["lineAmount"].setValue("0");
      this.addPOForm.controls["spendAmount"].setValue("0");
    }
  }

  saveAddBBLines() {
    if (this.addPOForm.value.poetNumber == null)
      this.toastr.error('Plesae Choose Poet Number', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    else if (this.addPOForm.value.projectName == null)
      this.toastr.error('Plesae Choose Project Name', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    else if (this.addPOForm.value.qty == null || this.addPOForm.value.qty <= 0)
      this.toastr.error('Plesae Enter Quantity', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    else if (this.addPOForm.value.unitPrice == null || this.addPOForm.value.unitPrice <= 0)
      this.toastr.error('Plesae Enter Unit Price', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });

    else if (this.addPOForm.value.remarks == null)
      this.toastr.error('Plesae Enter Remarks', 'Error Occured', {
        timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
      });
    else {
      this.isLoader = true;
      let objAddPOAmount: AddPOAmount = new AddPOAmount();
      objAddPOAmount.allocatedBudget = this.addPOForm.value.allocatedBudget;
      objAddPOAmount.availableActual = this.addPOForm.value.availableActual;
      objAddPOAmount.availableBudget = this.addPOForm.value.availableBudget;
      objAddPOAmount.bbHeaderId = this.bookingMasterID;
      objAddPOAmount.creadtedBy = this.loginUserName;
      objAddPOAmount.lineAmount = this.addPOForm.value.spendAmount;
      objAddPOAmount.poetNumber = this.addPOForm.value.poetNumber;
      objAddPOAmount.projectName = this.addPOForm.value.projectName;
      objAddPOAmount.quantity = this.addPOForm.value.qty;
      objAddPOAmount.remarks = this.addPOForm.value.remarks;
      objAddPOAmount.unitPrice = this.addPOForm.value.unitPrice;
      objAddPOAmount.updatedBy = this.loginUserName;
      this.modalService.dismissAll();
      this.service.addPOAmount(objAddPOAmount).subscribe((res) => {
        this.toastr.success('Success', 'Added the PO Value', {
          timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
        });
        setTimeout(() => {
          this.isLoader = false;
        }, 1000);
      });
    }
  }

}