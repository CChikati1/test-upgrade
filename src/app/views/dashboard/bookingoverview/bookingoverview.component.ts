import { Component, OnInit, AfterViewInit, Injectable, ElementRef, ViewChild, ChangeDetectorRef, Pipe, PipeTransform, Inject, PLATFORM_ID } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbDateStruct, NgbCalendar, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Select2OptionData } from 'ng-select2';
import { MonthClass } from '../MonthClass';
import { DataTableDirective } from 'angular-datatables';
import { ExcelService } from '../../../excel.service';
import { BudgetBookingLines } from '../budgetBookingClass';
import { CommonModule, DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { AccordionModule, TooltipModule } from '@coreui/angular';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SweetAlert2LoaderService, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { HighchartsChartModule } from 'highcharts-angular';
import { RoundPipe } from '../round.pipe';
import { NgbdDatepickerPopup } from '../datepicker-popup';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../_helpers/jwt.interceptor';
// import { extendsDirectlyFromObject } from '@angular/core/src/render3/jit/directive';
//import * as $ from 'jquery'
declare const $:any;

@Component({
  selector: 'app-bookingoverview',
  standalone: true,
  imports: [DecimalPipe,AccordionModule,DatePipe,
    TabsModule,SweetAlert2Module,NgSelectModule,ReactiveFormsModule,
    HighchartsChartModule,CommonModule,FormsModule,NgbModule,TooltipModule],
  templateUrl: './bookingoverview.component.html',
  styleUrl: './bookingoverview.component.scss',
  providers: [ApiService,ExcelService,ToastrService,NgbModalConfig,NgbdDatepickerPopup, NgbModal, {provide:SweetAlert2LoaderService,useClass:SweetAlert2LoaderService },RoundPipe],
  styles: [`
  .modal-lg{
      max-width: 1000px !important;
  }
    .modal-dialog {
        max-width: 1000px !important;
    } 
    div.my-modal > div.modal-dialog {
        width: 1000px !important;
      }
      .monthwisenumbers{
        color:blue;text-decoration:underline; cursor:pointer;
        text-align:right;
      }
      tbody th, table.dataTable tbody td {
        padding: 2px 5px !important;
    }
    table.dataTable.nowrap th  {
      white-space: normal;
     //  width:200px !important;
  }
    table.dataTable.nowrap td  {
      white-space: normal;
     //  width:200px !important;
  }
  
//   table.dataTable.nowrap thead tr td:first-child {
//      width:200px !important;
// }

#tblMonthOverview tr th,#tblMonthOverview tr td{
  padding:5px !important
}

#tblPOETHistory tfoot tr td {
  padding: 2px 5px 6px 18px !important;
}
.price-red {
  // apply your code like 
  color: red;
}

.greenClass {  }
      .redClass { color: red }
  `]
})
export class BookingoverviewComponent {

  applyHideClassForBookingOverview: boolean = false;
  applyHideClassForPOETHistory: boolean = true;
  applyHideClassForMonthWise: boolean = true;
  applyHideClassForMonthwiseHistory: boolean = true;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  private datatableElement: DataTableDirective;
  dataTable: any;
  objMonthClass: MonthClass;
  poetForm: FormGroup;
  searchYear: FormGroup;
  date: { year: number, month: number };
  model: NgbDateStruct;
  minDate = {};
  objBookingOverview: any;
  objPOETHistoy: any;
  public objPOETHistoyHeader: MonthClass;
  objMonthWise: any;
  objMonthwiseHistory: any = [];
  objLevel4Data: any;
  level2Desc: string;
  level3Desc: string;
  FCdesc: string;
  objProjects: any;
  objPoetNumbers: any;
  public dataProjects: Array<Select2OptionData>;
  public dataPOETNumber: Array<Select2OptionData>;
  modaltitle: string;
  modalsubtitle: string;
  monthPoetMasterID: number;
  dtOptions: any = {};
  BookedAmountTotal: number;
  PageBookedAmountTotal: number;
  selectedPOETNumber: any;
  selectedProjectName: any;
  selectedPeriodYear: any;
  isLoader: boolean;
  loginUserName: string = "Test@test.com";
  isBtnApprvEnabled: boolean = false;
  datas: any = [];
  objBudgetBookingLines: BudgetBookingLines;
  public objPoetUserData: BudgetBookingLines[] = [];
  public objBudgetAttachments: any = [];
  fileURL: string;
  public objPoetStatusData: any = [];
  public dataYear: Array<Select2OptionData>;
  
  table1: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private chRef: ChangeDetectorRef, private fb: FormBuilder, config: NgbModalConfig,
    private modalService: NgbModal, private service: ApiService, private excelService: ExcelService) {
      let items:any = [];
      items.push({ id: '2019', text: '2019' });
      items.push({ id: '2020', text: '2020' });
      items.push({ id: '2021', text: '2021' });
      items.push({ id: '2022', text: '2022' });
      items.push({ id: '2023', text: '2023' });
      items.push({ id: '2024', text: '2024' })
      this.dataYear = items;

      config.backdrop = 'static';
    config.keyboard = false;
    this.searchYear = this.fb.group({
      year: [""]
    });
    this.searchYear.controls["year"].setValue("2024");
  }

  // displayToConsole(datatableElement: DataTableDirective): void {
  //   datatableElement.dtInstance.then((dtInstance: DataTables.Api) => console.log(dtInstance));
  // }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import jQuery
      import('jquery').then(($) => {
        // Use jQuery in the browser environment
        console.log('jQuery is available:', $);
      }).catch(err => {
        console.error('Failed to load jQuery', err);
      });
    }
  }
  ngOnInit() {
    this.isLoader = true;
    if (isPlatformBrowser(this.platformId)) {
      import('jquery').then((jQueryModule) => {
        const $ = jQueryModule.default; // jQuery is loaded

        // Execute jQuery code after it is loaded
        $('a').removeClass('liactive');
        $('.liBudgetoverview').addClass('liactive');
        
      }).catch((err) => {
        console.error('Error loading jQuery:', err);
      });
    }
   
    this.getUserName();
    this.modaltitle = 'Budget Overview';
    this.objPOETHistoyHeader = new MonthClass;
    this.createForm();
  }

  createForm() {
    this.poetForm = this.fb.group({
      remarks: [],
      totalAmount: [],
      description: [],
      justification: [],
      bbHeaderID: [],
      requestedby: [],
      bbstatus: []
    });
  }

  changedYear(e: any): void {
    this.isLoader = true;
    this.GetBudgetTrackingData(false, e.text)
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


  openPoet(poet:any) {
    this.isLoader = true;
    this.service.getBBbyId(poet.BB_HEADER_ID).subscribe((response:any) => {
      this.objBudgetBookingLines = new BudgetBookingLines();
      this.objBudgetBookingLines.bbheaderId = parseInt(poet.BB_HEADER_ID);
      let attachmentId : any = { "bbHeaderId" : this.objBudgetBookingLines.bbheaderId};
      this.service.getAllAttachements(attachmentId).subscribe(downloadResponse => {
        this.objBudgetAttachments = downloadResponse;
      });
      this.objPoetStatusData = [];
      this.service.getApprovalList(this.objBudgetBookingLines.bbheaderId).subscribe(Statusres => {
        this.objPoetStatusData = Statusres;
      });
      this.service.getBudgetLines(this.objBudgetBookingLines).subscribe(res => {
        this.objPoetUserData = res as BudgetBookingLines[];
        let totalAmount: number = 0;
        this.poetForm.controls["requestedby"].setValue(response[0].KNOWN_NAME);
        this.poetForm.controls["description"].setValue(response[0].description);
        this.poetForm.controls["justification"].setValue(response[0].justification);
        this.poetForm.controls["bbstatus"].setValue(response[0].bbStatus);
        this.objPoetUserData.forEach(item => {
          totalAmount += Number(item.lineAmount);
        });
        this.poetForm.controls["totalAmount"].setValue(totalAmount);
        this.isBtnApprvEnabled = true;
        setTimeout(() => { this.isLoader = false; }, 1000);
      });
    });

  }

  GetBudgetTrackingData(flag: Boolean, year: string) {
    this.service.getBudgetTrackingData(year, this.loginUserName.toLowerCase()).subscribe((res) => {
      if (!flag) {
        const table: any = $("#tblBookingOverview").DataTable();
        table.destroy();
        this.chRef.detectChanges();
      }
      this.objBookingOverview = res;
      this.chRef.detectChanges();
      
      $(function () {
        if (flag) {
          $('#tblBookingOverview thead tr').clone(true).appendTo('#tblBookingOverview thead');
          let ele=$('#tblBookingOverview thead tr:eq(0) th') as JQuery<HTMLElement>;
          ele.each(function (i:any) {
            if (true) {
              var title = $(this).text();
              if (title == "") {
                $(this).html('');
              }
              else {
                if (i == 0 || i == 2 || i == 8)
                  $(this).html('<input type="text" style="width:80px;" placeholder="' + title + '" />');
                else if (i == 9 || i == 11 || i == 12)
                  $(this).html('<input type="text" style="width:100px;" placeholder="' + title + '" />');
                else if (i == 10 || i == 13 || i == 14 || i == 15 || i == 16 || i == 17 || i == 18)
                  $(this).html('<input type="text" style="width:130px;" placeholder="' + title + '" />');
                else $(this).html('<input type="text" placeholder="' + title + '" />');
                $('input', this).on('keyup change',  (event:any)=> {

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
        let windowHgt = Number($(window).height());
        let tableHgt = '200px';
        if (windowHgt > 400) {
          tableHgt = '500px';
        }
        let table = $('#tblBookingOverview').DataTable({
          "order": [[5, "asc"]],
          "dom": '<lf<t>ip>',
          pageLength: 100,
          destroy: true,
          scrollY: '40vh',
          scrollX: true,
          fixed: true,
          scrollCollapse: true,
          paging: false,
          fixedColumns: {
            leftColumns: 3,
          },
          buttons: [{
            extend: 'excelHtml5',
            className: "btn hide",
            titleAttr: 'Export in Excel',
            text: 'Excel',
            init: function (api:any, node:any, config:any) {
              $(node).removeClass('btn-default')
            }
          }],
        });

        // Filter event handler
        $(table.table().container()).on('keyup', 'thead input', (event:any)=> {
          table
            .search(event.target.value)
            .draw();
        });
      });
      setTimeout(() => { this.isLoader = false; }, 1000);
    }), (err:any) => {
      setTimeout(() => { this.isLoader = false; }, 1000);
    };
  }


  fnPoetAction(): void {
    this.datas = [];
    this.objPOETHistoy.forEach((item:any) => {
      let data = {
        'Booking Number': item.id,
        'Booking Status': item.bbStatus,
        'Booking Date': item.creationDate,
        'PO/Internal': item.poRequired,
        'Description': item.description,
        'Currency': item.currency,
        'Requested By': item.knownName,
        'PR NO': item.prNo,
        'PO NO': item.poNo,
        'Unit Price': item.unitPrice,
        'Qty': item.quantity,
        'Line Amount': item.bbfAmount,
        'PR Amount': item.prAmount,
        'PO Amount': item.poAmount,
        'Received Amount': item.poReceivedAmount,
        'Invoice Amount': item.poBilledAmount
      };
      this.datas.push(data);
    });
    this.excelService.exportAsExcelFile(this.datas, 'Poet History ' + this.selectedPOETNumber);
  }

  fnAction(): void {
    this.datas = [];
    this.objBookingOverview.forEach((item:any) => {
      parseFloat(item.fyBudget) - (parseFloat(item.bookedAmt) + parseFloat(item.prAmount) + parseFloat(item.poAMount))
      let data = {
        'CAPEX/OPEX': item.spendType,
        'Project Name': item.projectName,
        'POET Number': item.poetNumber,
        'Project Category': item.projectCategory,
        'L1': item.level1,
        'L2': item.level2,
        'L3': item.level3,
        'L4': item.level4,
        'POET Owner': item.knownName,
        'Period Year': item.periodYear,
        'FY Year Original Budget (AED)': item.currentYearBudget,
        'FY Year Revised Budget (AED)': item.fyBudget,
        'Next Year Spent Amount (AED)': item.nextYear,
        //'Spend To Date (AED)': parseFloat(item.BOOKED_AMT) + parseFloat(item.PR_AMOUNT) + parseFloat(item.PO_AMOOUNT) + parseFloat(item.RCVD_AMOUNT) + parseFloat(item.INV_AMOUNT) + parseFloat(item.INT_AMOUNT),
        //'Balance (AED)': parseFloat(item.FY_BUDGET) - parseFloat(item.BOOKED_AMT) + parseFloat(item.PR_AMOUNT) + parseFloat(item.PO_AMOOUNT) + parseFloat(item.RCVD_AMOUNT) + parseFloat(item.INV_AMOUNT) + parseFloat(item.INT_AMOUNT),
        'Spend To Date (AED)': parseFloat(item.bookedAmt) + parseFloat(item.prAmount) + parseFloat(item.poAmount),
        'Balance (AED)': parseFloat(item.fyBudget) - (parseFloat(item.bookedAmt) + parseFloat(item.prAmount) + parseFloat(item.poAmount)),
        'Booked Amount (AED)': item.bookedAmt,
        'Requisition Amount (AED)': item.prAmount,
        'PO Amount (AED)': item.poAmount,
        'Received Amount (AED)': item.rcvdAmount,
        'Invoice Amount (AED)': item.invAmount,
        //'Internal Amount (AED)': item.INT_AMOUNT
      };
      this.datas.push(data);
    });
    this.excelService.exportAsExcelFile(this.datas, 'Budget Overview');
  }

  public handleRefusalData(dismissMethod: string): void {
    // dismissMethod can be 'cancel', 'overlay', 'close', and 'timer'
    // ... do something
  }

  getUserName() {
    this.service.getUserName().subscribe((res) => {
      if (res != null && res != '') {
        let user = res as any;
      this.loginUserName = user.d.Email; //'veerender.kumar-e@maf.ae';//
        this.GetBudgetTrackingData(true, this.searchYear.controls["year"].value);
      }
     });
  }

  getSpendBudget(Monthpoet:any) {
    let sum: any = 0;
    sum += parseFloat(Monthpoet.bookedAmt)
    sum += parseFloat(Monthpoet.prAmount)
    sum += parseFloat(Monthpoet.poAmount)
    //sum += parseFloat(Monthpoet.RCVD_AMOUNT)
    //sum += parseFloat(Monthpoet.INV_AMOUNT)
    //sum += parseFloat(Monthpoet.INT_AMOUNT)
    return sum;
  }
  getBalance(Monthpoet:any) {
    let sum: any = 0;
    sum += parseFloat(Monthpoet.bookedAmt)
    sum += parseFloat(Monthpoet.prAmount)
    sum += parseFloat(Monthpoet.poAmount)
    //sum += parseFloat(Monthpoet.RCVD_AMOUNT)
    //sum += parseFloat(Monthpoet.INV_AMOUNT)
    //sum += parseFloat(Monthpoet.INT_AMOUNT)
    sum = parseFloat(Monthpoet.fyBudget) - sum;
    return sum;
  }

  getMonthwiseToatl(Monthpoet:any, content:any) {
    let sum: any = 0;
    sum += parseFloat(Monthpoet.JAN)
    sum += parseFloat(Monthpoet.FEB)
    sum += parseFloat(Monthpoet.MAR)
    sum += parseFloat(Monthpoet.APR)
    sum += parseFloat(Monthpoet.MAY)
    sum += parseFloat(Monthpoet.JUN)
    sum += parseFloat(Monthpoet.JUL)
    sum += parseFloat(Monthpoet.AUG);
    sum += parseFloat(Monthpoet.SEP);
    sum += parseFloat(Monthpoet.OCT);
    sum += parseFloat(Monthpoet.NOV);
    sum += parseFloat(Monthpoet.DEC);
    return sum;
  }

  poetHistory(Monthpoet:any, content:any) {
    this.isBtnApprvEnabled = false;
    this.objPOETHistoyHeader = new MonthClass;
    this.GetPoetHistoryData(Monthpoet, content);
  }

  monthWise(Monthpoet:any, content:any) {
    this.GetMonthOverviewData(Monthpoet);
    this.modalService.open(content, { size: 'lg', centered: true });
    this.applyHideClassForPOETHistory = true;
    this.applyHideClassForMonthWise = false;
    this.applyHideClassForMonthwiseHistory = true;
    this.modalsubtitle = 'Monthwise POET Details(AED) ' + '[Project:-' + this.selectedProjectName + ' , POET:-  ' + this.selectedPOETNumber + ']';
  }
  monthWiseHistory(Monthpoet:any, content:any, monthname:any) {
    if (Monthpoet.ALLOCATEDBUDGET != "Monthly Budget") {
      this.GetBudgetTrackingMonthwiseHistory(Monthpoet, monthname);
      this.applyHideClassForPOETHistory = true;
      this.applyHideClassForMonthWise = false;
      this.applyHideClassForMonthwiseHistory = false;
      this.modalsubtitle = 'Monthwise POET Details(AED) ' + '[Project:-' + this.selectedProjectName + ' , POET:-  ' + this.selectedPOETNumber + ']';
      this.monthPoetMasterID = Monthpoet.M_HEADER_ID;
    }
  }

  GetPoetHistoryData(Monthpoet:any, content:any) {
    this.selectedPOETNumber = Monthpoet.poetNumber;
    this.selectedProjectName = Monthpoet.projectName;
    this.objMonthClass = new MonthClass;
    this.objMonthClass.poetNumber = this.selectedPOETNumber;
    this.objMonthClass.month = "";
    this.objMonthClass.year = this.searchYear.controls["year"].value;
    this.service.getBudgetTrackingPoetData(this.objMonthClass).subscribe((res) => {
      this.modalService.open(content, { size: 'lg', centered: true });
      this.applyHideClassForPOETHistory = false;
      this.applyHideClassForMonthWise = true;
      this.applyHideClassForMonthwiseHistory = true;
      this.modalsubtitle = 'POET History';
      //let headerdetails = JSON.parse(res["header"]) as MonthClass;
      //this.objPOETHistoyHeader = headerdetails[0];
      this.objPOETHistoy = res;
      this.chRef.detectChanges();
      $(function () {
        $('#tblPOETHistory').DataTable({
          "dom": '<lf<t>ip>',
          pageLength: 100,
          destroy: true,
          scrollX: true,
          "paging": false,
          buttons: [{
            extend: 'excelHtml5',
            className: "btn hide",
            titleAttr: 'Export in Excel',
            text: 'Excel',
            init: function (api:any, node:any, config:any) {
              $(node).removeClass('btn-default')
            }
          }],
        });
      });
    });
  }

  GetMonthOverviewData(Monthpoet:any) {
    this.selectedPOETNumber = Monthpoet.POET_NUMBER;
    this.selectedProjectName = Monthpoet.PROJECT_NAME;
    this.selectedPeriodYear = Monthpoet.PERIOD_YEAR;
    this.objMonthClass = new MonthClass;
    this.objMonthClass.poetNumber = this.selectedPOETNumber;
    this.objMonthClass.month = "";
    this.objMonthClass.year = this.searchYear.controls["year"].value;
    this.service.getBudgetTrackingMonthwiseData(this.objMonthClass).subscribe((res) => {
      this.objMonthWise = res;
      this.chRef.detectChanges();
    });
  }

  GetBudgetTrackingMonthwiseHistory(Monthpoet:any, monthvalue:any) {
    //this.spinner.show();
    this.objMonthClass = new MonthClass;
    this.objMonthClass.poetNumber = this.selectedPOETNumber;
    this.objMonthClass.month = monthvalue;
    this.objMonthClass.year = this.searchYear.controls["year"].value;
    this.objMonthClass.serviceType = Monthpoet.ALLOCATEDBUDGET;
    this.objMonthwiseHistory = [];
    const table: any = $('#tblMonthOverviewHistory').DataTable();
    table.destroy();
    this.chRef.detectChanges();
    
    this.service.getBudgetTrackingMonthwiseHistory(this.objMonthClass)?.subscribe((res) => {
      let resule = res as [];
      this.objMonthwiseHistory = res;
      this.chRef.detectChanges();
      $(function () {
        $('#tblMonthOverviewHistory').DataTable({
          "dom": '<lf<t>ip>',
          pageLength: 100,
          destroy: true,
          scrollX: true,
          "paging": false,
          buttons: [{
            extend: 'excelHtml5',
            className: "btn hide",
            titleAttr: 'Export in Excel',
            text: 'Excel',
            init: function (api:any, node:any, config:any) {
              $(node).removeClass('btn-default')
            }
          }],
        });
      });
    });
    
  }

  getSum() {
    let sum = 20000;
    return sum;
  }


  getBookedAmountTotal() {
    let sum = 0;
    if (this.objBookingOverview != undefined)
      this.objBookingOverview.forEach((item:any) => { sum += parseFloat(item.bookedAmt); });
    return sum;
  }

  getRequisitionAmountTotal() {
    let sum: any = 0;
    if (this.objBookingOverview != undefined)
      this.objBookingOverview.forEach((item:any) => { sum += parseFloat(item.prAmount); });
    return sum;
  }

  getPOAmountTotal() {
    let sum: any = 0;
    if (this.objBookingOverview != undefined)
      this.objBookingOverview.forEach((item:any) => { sum += parseFloat(item.poAmount); });
    return sum;
  }

  getReceiptAmountTotal() {
    let sum: any = 0;
    if (this.objBookingOverview != undefined)
      this.objBookingOverview.forEach((item:any) => { sum += parseFloat(item.rcvdAmount); });
    return sum;
  }

  getInvoceAmountTotal() {
    let sum: any = 0;
    if (this.objBookingOverview != undefined)
      this.objBookingOverview.forEach((item:any) => { sum += parseFloat(item.invAmount); });
    return sum;
  }

  getInternalSpentAmountTotal() {
    let sum: any = 0;
    if (this.objBookingOverview != undefined)
      this.objBookingOverview.forEach((item:any) => { sum += parseFloat(item.intAmount); });
    return sum;
  }

  getPoetHistoryResevedAmountAEDTotal() {
    let sum: any = 0;
    if (this.objPOETHistoy != undefined)
      this.objPOETHistoy.forEach((item:any) => { sum += parseFloat(item.bbfAmount); });
    return sum;
  }

  getMonthwiseBalance(monthname:any) {
    let sum: any = 0;
    if (monthname != undefined && monthname != null && monthname != "") {
      if (this.objMonthWise != undefined) {
        let objLevel1 = [];
        let objLevel2 = [];
        objLevel1 = this.objMonthWise.filter((l:any) => l.ALLOCATEDBUDGET == "Monthly Budget");
        objLevel2 = this.objMonthWise.filter((l:any) => l.ALLOCATEDBUDGET != "Monthly Budget");
        if (monthname != "TOTAL") {
          if (objLevel2 != null && objLevel2.length > 0) {
            objLevel2.forEach((item:any) => { sum += parseFloat(item[monthname]); });
            sum = parseFloat(objLevel1[0][monthname]) - sum;
          }
        } else if (monthname == "TOTAL") {
          if (objLevel2 != null && objLevel2.length > 0) {
            objLevel2.forEach((item:any) => {
              sum += parseFloat(item.JAN) + parseFloat(item.FEB) + parseFloat(item.MAR) + parseFloat(item.APR) + parseFloat(item.MAY) + parseFloat(item.JUN)
                + parseFloat(item.JUL) + parseFloat(item.AUG) + parseFloat(item.SEP) + parseFloat(item.OCT) + parseFloat(item.NOV) + parseFloat(item.DEC);
            });
            sum = objLevel1[0].JAN + objLevel1[0].FEB + objLevel1[0].MAR + objLevel1[0].APR + objLevel1[0].MAY + objLevel1[0].JUN +
              objLevel1[0].JUL + objLevel1[0].AUG + objLevel1[0].SEP + objLevel1[0].OCT + objLevel1[0].NOV + objLevel1[0].DEC - sum;
          }
        }
      }
    }
    return sum;
  }
}

