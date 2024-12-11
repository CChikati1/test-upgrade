import { Component, OnInit, AfterViewInit, Injectable, ElementRef, ViewChild, ChangeDetectorRef, asNativeElements, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../../api.service';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
// import * as Highcharts from 'highcharts';
// import More from 'highcharts/highcharts-more';
// More(Highcharts);
// import Drilldown from 'highcharts/modules/drilldown';
// Drilldown(Highcharts);// Load the exporting module.
// import Exporting from 'highcharts/modules/exporting';
// Exporting(Highcharts);// Initialize exporting module.
// import * as moment from 'moment';
 import moment from 'moment';
 import { HighchartsChartModule } from 'highcharts-angular'
 
import { User } from './Users';


import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  NgForm
} from "@angular/forms";
import { NgSelect2Module, Select2OptionData } from "ng-select2";
import { Dashboard } from './masterPoetClass';
import { BudgetBookingLines, BudgetBookingApproval } from './budgetBookingClass';
import { ToastrService } from 'ngx-toastr';
// import { DashboardModule } from './dashboard.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'
 
//  import  $ from 'jquery';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
//declare const $:any;
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Highcharts from 'highcharts';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe,AccordionModule,
    TabsModule,SweetAlert2Module,NgSelectModule,ReactiveFormsModule,
    HighchartsChartModule,CommonModule 
  ],
  providers:[ApiService,ToastrService],
  // template: `<h1>Welcome to Your Component</h1>`,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})



export class DashboardComponent implements OnInit {

  isLoader: boolean | undefined;
  datacategories!: string[];
  loginUserName: string = "Test@test.com";
  DisplayName: string = "";
  Highcharts1:any;
  highcharts:any;
  chartOptions1:any;
  TotalAmount:any
  BookedAmount:any
  SpentAmount:any
  BalanceAmount:any

  seq!: string;

  budgetoverview1: boolean = false;
  budgetoverview2: boolean = false;
  budgetoverview3: boolean = false;
  budgetOverViewStatus1: boolean = false;
  budgetOverViewStatus2: boolean = false;
  budgetOverViewStatus3: boolean = false;

  budgetoverviewFunctionname: string = "";
  budgetstatusFunctionname: string = "";

  functionOverview: any = [];

  functionOverviewFilter: any = [];
  budgetOverviewFilterItem: any = [];

  functionOverviewFilter1: any = [];
  budgetStatusFilterItem: any = [];

  functionOverviewL2: any = [];
  functionOverviewL2Filter: any = [];
  functionOverviewL2Items: any = [];
  functionOverviewItem: any = [];
  functionOverviewL2Item: any = [];
  isSuperAdmin: boolean = false;

  searchForm: FormGroup;
  objDashboard!: Dashboard;
  objPendingApproval:any = [];

  objBudgetBookingApproval!: BudgetBookingApproval;

  public dataYear: Array<Select2OptionData>;
  public dataMonth: Array<Select2OptionData>;
  public dataBudgetType: Array<Select2OptionData>;
  public dataProjectCategory: Array<Select2OptionData>;
  public dataDepartment: Array<Select2OptionData>;

  BBFNo!: string;
  approvalId!: string;
  modaltitle: string;
  EMAIL_ADDRESS: string = "";
  isBtnApprvEnabled: boolean = false;
  message: string | undefined;
  userName: string = "";
  objBudgetBookingLines: BudgetBookingLines | undefined;
  applyHideClassForBooking: boolean = false;
  objBookings: any;
  objUser: any ;
  public objBudgetAttachments: any = [];
  objPoetUserData: BudgetBookingLines[] = [];
  angForm: FormGroup;
  isBtnEnabled: boolean = true;
  approvalView: boolean = false;
  fileURL!: string;
  isBrowser: boolean;
  constructor(private chRef: ChangeDetectorRef,
    private service: ApiService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.searchForm = this.fb.group({
      budgetType: [""],
      year: ['2024'],
      month: [""],
      projectCategory: [""],
      department: [""]
    });
    this.modaltitle = 'Budget Booking Approval';
    this.angForm = this.fb.group({
      requestedby: [],
      totalAmount: [],
      description: [],
      justification: [],
      remarks: []
    });

    
    if (isPlatformBrowser(this.platformId)) {
      
    
      import('jquery').then(($) => {
        // jQuery is now available for use in the browser
       // //console.log('jQuery loaded in the browser');
      });
      
     
    }
    
    let items:any = [];
    items.push({ id: '2019', text: '2019' });
    items.push({ id: '2020', text: '2020' });
    items.push({ id: '2021', text: '2021' });
    items.push({ id: '2022', text: '2022' });
    items.push({ id: '2023', text: '2023' });
    items.push({ id: '2024', text: '2024' })
    this.dataYear = items;
    items= [];
    items.push({ id: 'ALL', text: 'ALL' });
    items.push({ id: 'Brand', text: 'Customer Marketing & Brand' });
    items.push({ id: 'Charge Back', text: 'Direct Charge to OpCos' });
    items.push({ id: 'Comms', text: 'Corporate Communications' });
    items.push({ id: 'Loyalty', text: 'SHARE' });
    this.dataDepartment = items;
    items = [];
    items.push({ id: 'ALL', text: 'ALL' });
    items.push({ id: 'CAPEX', text: 'CAPEX' });
    items.push({ id: 'OPEX', text: 'OPEX' });
    items.push({ id: 'OPEX LICENSES / SUBSCRIPTIONS', text: 'OPEX LICENSES / SUBSCRIPTIONS' });
    items.push({ id: 'OPEX ANNUAL SUBSCRIPTIONS & MEMBERSHIPS', text: 'OPEX ANNUAL SUBSCRIPTIONS & MEMBERSHIPS' });	
    this.dataBudgetType = items;

    items = [];
    items.push({ id: 'ALL', text: 'ALL' });
items.push({id: 'Advertising and Media',text: 'Advertising and Media' });
items.push({id: 'Brand Health & Superiority Tracker', text: 'Brand Health & Superiority Tracker' });
items.push({id: 'Brand Strategy & Design', text: 'Brand Strategy & Design'});
items.push({id: 'Capability Building', text: 'Capability Building'});
items.push({id: 'CCO Budget', text: 'CCO Budget'});
items.push({id: 'CEO Holding Requirements', text: 'CEO Holding Requirements'});
items.push({id: 'Consumer Research', text: 'Consumer Research'});
items.push({id: 'Corporate Brand Manifestation & Governance', text: 'Corporate Brand Manifestation & Governance'});
items.push({id: 'CVM', text: 'CVM'});
items.push({id: 'CVM Lifecycle Marketing', text: 'CVM Lifecycle Marketing'});
items.push({id: 'CX CoE', text: 'CX CoE'});
items.push({id: 'CX Design', text: 'CX Design'});
items.push({id: 'CX Services', text: 'CX Services'});
items.push({id: 'Data Analytics', text: 'Data Analytics'});
items.push({id: 'Data Engineering and Infrastructure', text: 'Data Engineering and Infrastructure'});
items.push({id: 'Dialogue', text: 'Dialogue'});
items.push({id: 'Digital Analytics', text: 'Digital Analytics'});
items.push({id: 'Global Contact Centre', text: 'Global Contact Centre'});
items.push({id: 'Happiness Lab', text: 'Happiness Lab'});
items.push({id: 'Innovation Programme', text: 'Innovation Programme'});
items.push({id: 'Live Chat & AI Driven ChatBot', text: 'Live Chat & AI Driven ChatBot'});
items.push({id: 'M-PASS', text: 'M-PASS'});
items.push({id: 'OneView', text: 'OneView'});
items.push({id: 'Organisation', text: 'Organisation'});
items.push({id: 'Other Marketing', text: 'Other Marketing'});
items.push({id: 'PIM', text: 'PIM'});
items.push({id: 'SEO', text: 'SEO'});
items.push({id: 'Uniforms', text: 'Uniforms'});
items.push({id: 'VOC Programme', text: 'VOC Programme'});

    this.dataProjectCategory = items;

    items = [];
    items.push({ id: 'ALL', text: 'ALL' });
    items.push({ id: 'JAN', text: 'JAN' });
    items.push({ id: 'FEB', text: 'FEB' });
    items.push({ id: 'MAR', text: 'MAR' });
    items.push({ id: 'APR', text: 'APR' });
    items.push({ id: 'MAY', text: 'MAY' });
    items.push({ id: 'JUN', text: 'JUN' });
    items.push({ id: 'JUL', text: 'JUL' });
    items.push({ id: 'AUG', text: 'AUG' });
    items.push({ id: 'SEP', text: 'SEP' });
    items.push({ id: 'OCT', text: 'OCT' });
    items.push({ id: 'NOV', text: 'NOV' });
    items.push({ id: 'DEC', text: 'DEC' });
    this.dataMonth = items;
    this.searchForm.controls["year"].setValue("2024");
    this.searchForm.controls["month"].setValue("ALL");
    this.searchForm.controls["projectCategory"].setValue("ALL");
    this.searchForm.controls["budgetType"].setValue("ALL");
    this.searchForm.controls["department"].setValue("ALL");
  }

  
  budgetOverviewOptions:any;
  budgetStatusOptions:any;
  budgetChartOptions:any;
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import jQuery
      import('jquery').then(($) => {
        // Use jQuery in the browser environment
        //console.log('jQuery is available:', $);
      }).catch(err => {
        console.error('Failed to load jQuery', err);
      });
    }
  }
 async ngOnInit() {
  
  if (typeof window !== 'undefined') {
      // Browser-specific code
      (window as any).jQuery = $;
      (window as any).$ = $;
      const Highcharts =await import('highcharts');
      this.highcharts = Highcharts;
       this.Highcharts1 = Highcharts.default;
      // this.chartOptions1 = {
      //   chart: {
      //     type: 'line',
      //   },
      //   title: {
      //     text: 'Sample Highcharts in Angular 18',
      //   },
      //   series: [
      //     {
      //       name: 'Sample Data',
      //       type: 'line',
      //       data: [1, 3, 2, 4],
      //     },
      //   ],
      // };
      //console.log('Running in browser environment');
    } else {
      //console.log('Running in server environment');
    }
    //alert("hh")
    this.isLoader = true;
    // $('a').removeClass('liactive');
    // $('.lidashboard').addClass('liactive');
   this.getUserName();
   // this.budgetOverviewSeries.nativeElement.height = "500px"
  }
  public handleRefusalData(dismissMethod: Event): void {
  }
  budgetOverView(budgetoverview1:any, budgetoverview2:any, budgetoverview3:any, level1:any) {
    this.budgetoverview1 = budgetoverview1;
    this.budgetoverview2 = budgetoverview2;
    this.budgetoverview3 = budgetoverview3;
    this.functionOverviewItem = [];
    this.functionOverview.forEach((item:any) => {
      if (item.totalLevel1 == level1) {
        this.functionOverviewItem.push(item);
      }
    });
  }

  public loadChart() {
    this.budgetOverview();
    this.budgetChart();
    this.budgetStatus();
  }

  public changedYear(e: any): void {
    this.isLoader = true;
    this.objDashboard = new Dashboard();
    this.objDashboard.spendType = this.searchForm.controls["budgetType"].value;
    this.objDashboard.projectCategory  = this.searchForm.controls["projectCategory"].value;
    this.objDashboard.department = this.searchForm.controls["department"].value;
    this.objDashboard.year = e.text;
    if( this.searchForm.controls["month"].value == "ALL")
      this.objDashboard.month =  "'JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'";
    else 
      this.objDashboard.month =  this.searchForm.controls["month"].value;
    this.objDashboard.email = this.loginUserName.toLowerCase();
    this.loadChart();
  }

  public changedMonth(e: any): void {
    this.isLoader = true;
    this.objDashboard = new Dashboard();
    this.objDashboard.spendType = this.searchForm.controls["budgetType"].value;
    this.objDashboard.year =  this.searchForm.controls["year"].value;
    this.objDashboard.projectCategory  = this.searchForm.controls["projectCategory"].value;
    this.objDashboard.department = this.searchForm.controls["department"].value;
    if( e.value == "ALL")
      this.objDashboard.month =  "'JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'";
    else 
      this.objDashboard.month =  e.text;
    this.objDashboard.email = this.loginUserName.toLowerCase();
    this.loadChart();
  }

  public changedDepartment(e: any): void {
    this.isLoader = true;
    this.objDashboard = new Dashboard();
    this.objDashboard.spendType = this.searchForm.controls["budgetType"].value;
    this.objDashboard.year =  this.searchForm.controls["year"].value;
    this.objDashboard.projectCategory  = this.searchForm.controls["projectCategory"].value;
    if(this.searchForm.controls["month"].value == "ALL")
      this.objDashboard.month =  "'JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'";
    else 
        this.objDashboard.month =  this.searchForm.controls["month"].value;
    this.objDashboard.department = e.text;
    this.objDashboard.email = this.loginUserName.toLowerCase();
    this.loadChart();
  }

  
  public changedBudgetType(e: any): void {
    this.isLoader = true;
    this.objDashboard = new Dashboard();
    this.objDashboard.spendType = e.text;
    this.objDashboard.year = this.searchForm.controls["year"].value;
    this.objDashboard.projectCategory = this.searchForm.controls["projectCategory"].value;
    this.objDashboard.department = this.searchForm.controls["department"].value;
    if(this.searchForm.controls["month"].value == "ALL")
    this.objDashboard.month =  "'JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'";
  else 
      this.objDashboard.month =  this.searchForm.controls["month"].value;
    this.objDashboard.email = this.loginUserName.toLowerCase();
    this.loadChart();
  }

  public changedProjectCategory(e: any): void {
    this.isLoader = true;
    this.objDashboard = new Dashboard();
    this.objDashboard.spendType = this.searchForm.controls["budgetType"].value;
    this.objDashboard.year = this.searchForm.controls["year"].value;    
    this.objDashboard.projectCategory = e.text;
    this.objDashboard.department = this.searchForm.controls["department"].value;
    if(this.searchForm.controls["month"].value == "ALL")
    this.objDashboard.month =  "'JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'";
  else 
      this.objDashboard.month =  this.searchForm.controls["month"].value;
    this.objDashboard.email = this.loginUserName.toLowerCase();
    this.loadChart();
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

  getMyPendingApprovals() {
    this.service.myPendingApproval(this.loginUserName.toLocaleLowerCase()).subscribe((res) => {
    //this.service.myPendingApproval('marwan.othman@maf.ae').subscribe((res) => {
      if (res != null && res != '') {
        let pendingApproval = res as any;
        this.objPendingApproval = pendingApproval;
      }
    });
  }

  bbfPendingApproval(approval:any) {
    this.isLoader = true;
    this.BBFNo = approval.bbHeaderId;
    this.approvalId = approval.approvalId;
    this.seq = approval.approvalSequence;
    this.getApprovalDetails(this.approvalId)
    this.GetData(true);
  }

  
  saveDatatoDB(angForm: FormGroup, isSubmitted: boolean) {
    this.isLoader = true;
    let checkval = true;
    if (isSubmitted == false) {
      if (angForm.value.remarks == null || angForm.value.remarks == "") {
        checkval = false;
        this.toastr.error('Failed', 'Please enter Remarks', {
          timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', easeTime: 300
        });
        this.isLoader = false;
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


  getApprovalDetails(id:any) {
    this.service.getApprovalDetails(id).subscribe((res) => {
      if (res != null && res != '') {
        let user = res as any;
        this.objUser = user;
        //this.EMAIL_ADDRESS = user[0].EMAIL_ADDRESS;
        this.EMAIL_ADDRESS = user.approvalReqFrom;
        this.approvalView = true;
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

  GetData(isonint: boolean) {
    this.objBudgetBookingLines = new BudgetBookingLines();
    this.objBudgetBookingLines.bbheaderId = parseInt(this.BBFNo);
    this.service.getBBbyId(this.BBFNo).subscribe((res) => {
      this.objBookings = res;
      this.service.getCMBUser(this.objBookings.requestedBy).subscribe(cmbres => {
        let cmbUser: any = cmbres;
      //this.objBookings = this.objBookings.filter(l => l.id == this.BBFNo);
      this.service.getBudgetLines(this.objBudgetBookingLines).subscribe(response => {
        let attachmentId : any = { "bbHeaderId" : this.objBudgetBookingLines?.bbheaderId};
        this.service.getAllAttachements(attachmentId).subscribe(downloadResponse => {
          this.objBudgetAttachments = downloadResponse;
        });
        this.objPoetUserData = response as BudgetBookingLines[];
        let totalAmount: number = 0;
        this.angForm.controls["requestedby"].setValue(cmbUser.fullName);
        this.angForm.controls["description"].setValue(this.objBookings.description);
        this.angForm.controls["justification"].setValue(this.objBookings.justification);
        //this.angForm.controls["remarks"].setValue("actioned by " + this.loginUserName.toLowerCase());
        this.objPoetUserData.forEach(item => {
          totalAmount += Number(item.lineAmount);
        });
        this.angForm.controls["totalAmount"].setValue(totalAmount);
        this.isBtnEnabled = true;
        setTimeout(() => { this.isLoader = false; }, 500);
      });
      this.chRef.detectChanges();
    });
  });
  }



  budgetOverViewStatus(budgetOverViewStatus1:any, budgetOverViewStatus2:any, budgetOverViewStatus3:any, level1:any, level2:any) {
    this.budgetOverViewStatus1 = budgetOverViewStatus1;
    this.budgetOverViewStatus2 = budgetOverViewStatus2;
    this.budgetOverViewStatus3 = budgetOverViewStatus3;
    this.functionOverviewL2Item = [];
    this.functionOverviewL2Filter = [];
    this.functionOverviewL2.forEach((item:any) => {
      if (level2 == null) {
        if (item.totalLevel1 == level1) {
          this.functionOverviewL2Item.push(item);
        }
      }
      else {
        if (item.totalLevel1 == level1 && item.totalLevel2 == level2) {
          this.functionOverviewL2Item.push(item);
        }
      }
    });
    this.functionOverviewL2Item.forEach((item:any) => {
      const index: number = this.functionOverviewL2Items.indexOf(item.totalLevel1);
      if (index == -1)
        this.functionOverviewL2Filter.push(item);
    });
  }

  budgetOverviewFilter(item:any) {
    const index: number = this.budgetOverviewFilterItem.indexOf(item.options.name);

    if (index !== -1)
      this.budgetOverviewFilterItem.splice(index, 1);

    if (item.options.visible || item.options.visible == undefined)
      this.budgetOverviewFilterItem.push(item.options.name);

    this.functionOverviewFilter = [];
    this.functionOverview.forEach((item:any) => {
      const index: number = this.budgetOverviewFilterItem.indexOf(item.totalLevel1);
      if (index == -1)
        this.functionOverviewFilter.push(item);
    });
  }


  budgetStatusFilter(item:any) {
    if (this.budgetOverViewStatus1) {
      const index: number = this.budgetStatusFilterItem.indexOf(item.options.name);
      if (index !== -1)
        this.budgetStatusFilterItem.splice(index, 1);

      if (item.options.visible || item.options.visible == undefined)
        this.budgetStatusFilterItem.push(item.options.name);

      this.functionOverviewFilter1 = [];
      this.functionOverview.forEach((item:any) => {
        const index: number = this.budgetStatusFilterItem.indexOf(item.totalLevel1);
        if (index == -1)
          this.functionOverviewFilter1.push(item);
      });
    }
    else if (this.budgetOverViewStatus2) {
      const index: number = this.functionOverviewL2Items.indexOf(item.options.name);
      if (index !== -1)
        this.functionOverviewL2Items.splice(index, 1);

      if (item.options.visible || item.options.visible == undefined)
        this.functionOverviewL2Items.push(item.options.name);

      this.functionOverviewL2Filter = [];
      this.functionOverviewL2Item.forEach((item:any) => {
        const index: number = this.functionOverviewL2Items.indexOf(item.totalLevel2);
        if (index == -1)
          this.functionOverviewL2Filter.push(item);
      });
    }
  }

  budgetOverview() {

    const payload = {
      year: '2024',
      spendType: 'ALL',
      email: 'veerender.kumar-e@maf.ae',
      month: 'ALL',
      projectCategory: 'ALL',
      department: 'ALL'
    };
//console.log(payload);
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json'
    });

    // this.http
    //   .post('https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/budgetBalance', payload, { headers })
    //   .subscribe(
    //     (response:any) => //console.log(response),
    //     (error:any) => console.error(error)
    //   );
  
    this.service.budgetBalance(this.objDashboard).subscribe(res => {
      this.service.functionOverview(this.objDashboard).subscribe(functionres => {
        var self = this;
        let response: any = res;
        response=response[0];
        self.budgetOverView(true, false, false, null);
        let spent = parseFloat(response.amountBilled);
        let booked = parseFloat(response.bookedAmt);
        let balance = parseFloat(response.totalAmt) - spent - booked;

        this.TotalAmount = response.totalAmt;
        this.BalanceAmount = balance;
        this.SpentAmount = spent;
        this.BookedAmount = booked;

        let functioResponse: any = functionres;
        this.functionOverview = functioResponse;
        this.functionOverviewFilter = functioResponse;
        this.functionOverviewFilter1 = functioResponse;
        let bookedDatas:any = [];
        let spentDatas :any= [];
        let balanceDatas :any= [];
        let functionOverviewSeries: any = [];
        functioResponse.forEach((item:any) => {
          let dataFunctionPoints: any = [];

          bookedDatas.push({ name: item.totalLevel1, y: Number(item.booked), drilldown: item.totalLevel1 });
          spentDatas.push({ name: item.totalLevel1, y: Number(item.spent), drilldown: item.totalLevel1 });
          balanceDatas.push({ name: item.totalLevel1, y: Number(item.balance), drilldown: item.totalLevel1 });

          dataFunctionPoints.push({ name: "Balance", y: Number(item.balance) });
          dataFunctionPoints.push({ name: "Booked", y: Number(item.booked) });
          dataFunctionPoints.push({ name: "Spent", y: Number(item.spent) });

          functionOverviewSeries.push({ name: item.totalLevel1, id: item.totalLevel1, data: dataFunctionPoints });
        })

        functionOverviewSeries.push({ name: "Balance", id: "Balance", data: balanceDatas });
        functionOverviewSeries.push({ name: "Booked", id: "Booked", data: bookedDatas });
        functionOverviewSeries.push({ name: "Spent", id: "Spent", data: spentDatas });


        let count = 0;
        this.budgetOverviewOptions ={
          chart: {
            type: 'pie',
            margin: [80, 200, 0, 0],
            events: {
              drillup: function (e:any) {
                count--;
                if (count == 0)
                  self.budgetOverView(true, false, false, null);
                else if (count == 1)
                  self.budgetOverView(false, true, false, null);
                else if (count == 2)
                  self.budgetOverView(false, false, true, null);
              },
              drilldown: function (e:any) {
                count++;
                if (count == 1) {
                  self.budgetOverView(false, true, false, e.point.name);
                  self.budgetoverviewFunctionname = e.point.name
                } else if (count == 2) {
                  self.budgetOverView(false, false, true, e.point.name);
                  self.budgetoverviewFunctionname = e.point.name
                }
              }
            }
          },
          legend: {
            enabled: true,
            floating: true,
            verticalAlign: 'center',
            align: 'right',
            layout: 'vertical',
            useHTML: true,
            y: 50, //chart.height/4
            x: -50,
            labelFormatter: function (this: Highcharts.Point):string {
              return '<span title=' + this.name + '>' + this.name + '</span>';
            }
          },
          exporting: {
            filename: moment(new Date()).format('DD-MMM-YYYY HH:mm')
          },
          colors: ['#f89715', '#6ca439', '#00467f', '#5f6062', '#fdb913', '#00b1b0', '#0096d6', '#aca39a', '#fdcfa1', '#c7daae', '#99abc4', '#b9b9ba', '#fdd9a3', '#b0d5ce', '#b7d6f1', '#e0dad5'],
          title: {
            text: 'Budget Overview -' + this.searchForm.controls["year"].value
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: false,
                format: '{point.name}: {point.y:.2f}'
              },
              allowPointSelect: true,
              cursor: 'pointer',
              borderWidth: 0,
              showInLegend: true,
              point: {
                events: {
                  legendItemClick: function () {
                    self.budgetOverviewFilter(this);
                  }
                }
              }
            }
          },
          tooltip: {
            //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            useHTML: true,
            formatter: function (this: Highcharts.TooltipFormatterContextObject):string {
              //let y = this.y/1000000;
              const value = this.y ?? 0; 
              if (parseInt(Highcharts.numberFormat(value / 1000000, 0)) == 0)
                return '<span style="font-size:12px"><b>' + this.point.options.name + '</b></span><br>' + Highcharts.numberFormat(value / 1000000, 2) + "M";
              else
                return '<span style="font-size:12px"><b>' + this.point.options.name + '</b></span><br>' + Highcharts.numberFormat(value / 1000000, 0) + "M";
            }
          },
          series: [
            {
              name: "Budget Overview",
              colorByPoint: true,
              data: [
                { name: "Balance", y: Number(balance), drilldown: "Balance" },
                { name: "Booked", y: Number(booked), drilldown: "Booked" },
                { name: "Spent", y: Number(spent), drilldown: "Spent" }
              ]
            },
          ],
          drilldown: {
            drillUpButton: {
              relativeTo: "spacingBox",
              position: {
                y: 25,
                x: 0,
                align: "left"
              },
            },
            series: functionOverviewSeries
          }
        };
        this.isLoader = false;
      });
    });
  }

  budgetStatus() {
    //console.log(this.objDashboard);
    this.service.functionL2Overview(this.objDashboard).subscribe(res => {
      let response: any = [];
      var self = this;
      self.budgetOverViewStatus(true, false, false, null, null);
      response = res;
      this.functionOverviewL2 = response;
      let functionOverviewSeries: any = [];
      let functionDrillDownOverviewSeries: any = [];
      let datapoints: any = [];
      let uniqueLevel1:any = [];
      let count = 0;
      response.forEach((item:any) => {
        let count = uniqueLevel1.indexOf(item.totalLevel1);
        if (count == -1)
          uniqueLevel1.push(item.totalLevel1);
      });

      uniqueLevel1.forEach((level1:any) => {
        let tempTotal = 0;
        let datapointsDrillDown: any = [];

        response.forEach((item:any) => {
          if (level1 == item.totalLevel1) {
            let datapointsDrillDown2: any = [];
            tempTotal = Number(tempTotal) + Number(item.totalAmount);
            datapointsDrillDown.push({ name: item.totalLevel2, y: Number(item.totalAmount), drilldown: item.totalLevel1 + "_" + item.totalLevel2 })
            datapointsDrillDown2.push({ name: "Balance", y: Number(item.balance) });
            datapointsDrillDown2.push({ name: "Booked", y: Number(item.booked) });
            datapointsDrillDown2.push({ name: "Spent", y: Number(item.spent) });
            functionDrillDownOverviewSeries.push({ name: item.totalLevel2, id: item.totalLevel1 + "_" + item.totalLevel2, data: datapointsDrillDown2 });
          }
        });
        functionDrillDownOverviewSeries.push({ name: level1, id: level1, data: datapointsDrillDown });
        datapoints.push({ name: level1, y: Number(tempTotal), drilldown: level1 })
      });
      functionOverviewSeries.push({ name: "Budget Status", colorByPoint: true, data: datapoints });
      this.budgetStatusOptions  = {
        chart: {
          type: 'pie',
          margin: [80, 200, 0, 0],
          events: {
            drillup: function (e:any) {
              count--;
              if (count == 0)
                self.budgetOverViewStatus(true, false, false, null, null);
              else if (count == 1)
                self.budgetOverViewStatus(false, true, false, self.budgetstatusFunctionname, null);
              else if (count == 2)
                self.budgetOverViewStatus(false, false, true, null, null);
            },
            drilldown: function (e:any) {
              count++;
              if (count == 1) {
                self.budgetstatusFunctionname = e.point.name
                self.budgetOverViewStatus(false, true, false, self.budgetstatusFunctionname, null);
              } else if (count == 2) {
                self.budgetOverViewStatus(false, false, true, self.budgetstatusFunctionname, e.point.name);
              }
            }
          }
        },
        title: {
          text: 'Budget Status - ' + this.searchForm.controls["year"].value
        },
        legend: {
          enabled: true,
          floating: true,
          verticalAlign: 'center',
          align: 'right',
          layout: 'vertical',
          useHTML: true,
          y: 50, //chart.height/4
          x: -50,
          labelFormatter: function (this: Highcharts.Point):string {
            return '<span title=' + this.name + '>' + this.name + '</span>';
          }
        },
        colors: ['#f89715', '#6ca439', '#00467f', '#5f6062', '#fdb913', '#00b1b0', '#0096d6', '#aca39a', '#fdcfa1', '#c7daae', '#99abc4', '#b9b9ba', '#fdd9a3', '#b0d5ce', '#b7d6f1', '#e0dad5'],
        plotOptions: {
          size: '50%',
          series: {
            dataLabels: {
              enabled: false,
              format: '{point.name}: {point.y:.2f}'
            },
            allowPointSelect: true,
            cursor: 'pointer',
            borderWidth: 0,
            showInLegend: true,
            point: {
              events: {
                legendItemClick: function () {
                  self.budgetStatusFilter(this);
                }
              }
            }
          }
        },
        exporting: {
          filename: moment(new Date()).format('DD-MMM-YYYY HH:mm')
        },
        tooltip: {
          useHTML: true,
          formatter: function (this: Highcharts.TooltipFormatterContextObject):string {
            //let y = this.y/1000000;
            const value = this.y ?? 0; 
            if (parseInt(Highcharts.numberFormat(value / 1000000, 0)) == 0)
              return '<span style="font-size:12px"><b>' + this.point.options.name + '</b></span><br>' + Highcharts.numberFormat(value / 1000000, 2) + "M";
            else
              return '<span style="font-size:12px"><b>' + this.point.options.name + '</b></span><br>' + Highcharts.numberFormat(value / 1000000, 0) + "M";
          }
        },
        series: functionOverviewSeries,
        drilldown: {
          drillUpButton: {
            relativeTo: "spacingBox",
            position: {
              y: 25,
              x: 0,
              align: "left"
            },
          },
          series: functionDrillDownOverviewSeries
        }
      };

      //this.budgetStatusSeriesChart = chart(this.budgetStatusSeries.nativeElement, barOptions);
      ////this.budgetStatusSeries.addSeries({ name: 'Month', data: Response.month });
    });
  }


  budgetChart() {
    //console.log(this.objDashboard);
    this.service.spendMonthlyWise(this.objDashboard).subscribe(res => {
      let response: any = res
      let spendMonthlyWiseSeries:any = [];
      response.forEach((item:any) => {
        let dataPoints:any = [];
        dataPoints.push(parseFloat(item.jan));
        dataPoints.push(parseFloat(item.feb));
        dataPoints.push(parseFloat(item.mar));
        dataPoints.push(parseFloat(item.apr));
        dataPoints.push(parseFloat(item.may));
        dataPoints.push(parseFloat(item.jun));
        dataPoints.push(parseFloat(item.jul));
        dataPoints.push(parseFloat(item.aug));
        dataPoints.push(parseFloat(item.sep));
        dataPoints.push(parseFloat(item.oct));
        dataPoints.push(parseFloat(item.nov));
        dataPoints.push(parseFloat(item.dec));
        spendMonthlyWiseSeries.push({ name: item.level1, data: dataPoints });
      });
      this.budgetChartOptions = {
        chart: {
          type: 'line'
        },
        credits: {
          enabled: true
        },
        exporting: {
          filename: moment(new Date()).format('DD-MMM-YYYY HH:mm')
        },
        title: {
          text: 'Budget Trending'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        colors: ['#f89715', '#6ca439', '#00467f', '#5f6062', '#fdb913', '#00b1b0', '#0096d6', '#aca39a', '#fdcfa1', '#c7daae', '#99abc4', '#b9b9ba', '#fdd9a3', '#b0d5ce', '#b7d6f1', '#e0dad5'],
        yAxis: {
          title: {
            text: 'Amount'
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: false
            },
            enableMouseTracking: true
          }
        },
        series: spendMonthlyWiseSeries
      };     
    });
  }

  getUserName() {
   // this.service.getUserDetails().subscribe((res) => {
     // //console.log(res);
      //if (res != null && res != '') {
       // let user = res as any;
        this.loginUserName ='veerender.kumar-e@maf.ae';// user.d.Email;
        this.DisplayName ='Veerender Kumar';// user.d.Title;
        this.objDashboard = new Dashboard();
        this.objDashboard.spendType = this.searchForm.controls["budgetType"].value;
        this.objDashboard.year = this.searchForm.controls["year"].value;
        this.objDashboard.month =  this.searchForm.controls["month"].value;
        this.objDashboard.projectCategory  = this.searchForm.controls["projectCategory"].value;
        this.objDashboard.department=this.searchForm.controls["department"].value;
        this.objDashboard.email = this.loginUserName.toLowerCase();
       // this.service.getEmployee(this.loginUserName).subscribe((res) => {
          //if (res != null && res != '') {
            // let users = res as any;
            // let c: any = users.d.results as [];
            // if (c[0].Role == "Super Admin")
               this.isSuperAdmin = true;
            // else
            //   this.isSuperAdmin = false;
            this.loadChart();
            this.getMyPendingApprovals();
         // }
        //});
    //  }
    //});
  }


}
