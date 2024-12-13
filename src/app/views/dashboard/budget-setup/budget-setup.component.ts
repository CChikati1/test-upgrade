import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Inject, PLATFORM_ID,AfterViewInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { NgbModalConfig, NgbModal, NgbDateStruct, NgbCalendar, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators, FormControl} from '@angular/forms';

import { CommonModule, DatePipe, DecimalPipe, isPlatformBrowser } from "@angular/common";
import { ApiService } from "../../../api.service";
import { ToastrService } from "ngx-toastr";
// import { Select2OptionData } from "ng-select2";
import { NgSelectModule } from '@ng-select/ng-select';  
import { PoetClass } from "../PoetClass";
import { ExcelService } from '../../../excel.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
// import { Api } from 'datatables.net';
import { User } from "../../theme/Users";
// import $ from 'jquery';
// @Component({
//   templateUrl: "budgetSetup.component.html",
//   providers: [NgbModalConfig, NgbModal]
// })
declare const $:any;

import { Select2OptionData } from "ng-select2";

import { SweetAlert2LoaderService, SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { HighchartsChartModule } from "highcharts-angular";
import { RoundPipe } from "../round.pipe";
import { JwtInterceptor } from "../../_helpers/jwt.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgbdDatepickerPopup } from "../datepicker-popup";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { TabsModule } from "ngx-bootstrap/tabs";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe,AccordionModule,
    TabsModule,SweetAlert2Module,NgSelectModule,ReactiveFormsModule,
    HighchartsChartModule,CommonModule 
  ],
  providers:[ApiService,ExcelService,ToastrService,NgbModalConfig,NgbdDatepickerPopup, NgbModal, {provide:SweetAlert2LoaderService,useClass:SweetAlert2LoaderService },RoundPipe],
   templateUrl: './budget-setup.component.html'
})
export class BudgetSetupComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private datatableElement: DataTableDirective;
  dataTable: any;
  objPoetClass: PoetClass;
  DummyPoets: PoetClass[];
  poetForm: FormGroup;
  date: { year: number; month: number };
  model: NgbDateStruct;
  minDate = {};
  objLevels: any;
  objLevel1: any;
  objLevel2: any;
  objLevel3: any;
  objLevel4: any;
  objUsers: any;
  public objPoets: PoetClass[] = [];
  objFCategories: any;
  objLevel2Data: any;
  objLevel3Data: any;
  objLevel4Data: any;
  level2Desc: string;
  level3Desc: string;
  FCdesc: string;
  signupForm: FormGroup;
  searchYear: FormGroup;
  public dataUsers: Array<Select2OptionData> = [];
  public dataFCategory: Array<any> = [];
  dtOptions: any;
  maxDate = {};
  user: User;
  enableUserAdd = "Add User";
  enableUserEdit = false;
  public dataYear: Array<Select2OptionData>;
  public projectTypes: Array<Select2OptionData>;
  public financeCategoryTypes: Array<Select2OptionData>;
  datas: any = [];
  objTeams: any;
  public objPoetUserData: User[] = [];
  public exampleData:Array<any> = [];
  public TeamData: Array<any> = [];
  modaltitle: string;
  poetMasterID: number;
  poetUserID: number;
  isLoader: boolean;
  loginUserName: string;
  dummyCheckBox: boolean = false;
  @Inject(PLATFORM_ID) private platformId: Object

  constructor(
    private router: Router,
    private frmbuilder: FormBuilder,
    private toastr: ToastrService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private service: ApiService,
    private excelService: ExcelService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.createPoetForm();
    this.createFormUser();

    this.searchYear = this.fb.group({
      year: ['2024']
    });

    let items:any = [];
    items.push({ id: '2019', text: '2019' });
    items.push({ id: '2020', text: '2020' });
    items.push({ id: '2021', text: '2021' });
    items.push({ id: '2022', text: '2022' });
    items.push({ id: '2023', text: '2023' });
    items.push({ id: '2024', text: '2024' })
    this.dataYear = items;
    // this.searchYear.controls["year"].setValue("2024");
    let category:any = [];
    category.push({ id: 'Capex', text: 'Capex' });
    category.push({ id: 'Opex', text: 'Opex' });
    this.financeCategoryTypes = category;

    let projectType:any = [];
    projectType.push({ id: 'BAU', text: 'BAU' });
    projectType.push({ id: 'NI', text: 'NI' });
    this.projectTypes = projectType;
    // this.searchYear.controls["year"].setValue("2024");
  }



  // displayToConsole(datatableElement: DataTableDirective): void {
  //   datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
  //     console.log(dtInstance)
  //   );
  // }

  // displayToConsole(datatableElement: DataTableDirective): void {
  //   datatableElement.dtInstance.then((dtInstance: Api) => {
  //     // `dtInstance` is of type `Api`
  //     console.log(dtInstance);
  //   });
  // } 


  ngOnInit() {
  
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import jQuery
      import('jquery').then(($) => {
        // Use jQuery in the browser environment
        //console.log('jQuery is available:', $);
      }).catch(err => {
        console.error('Failed to load jQuery', err);
      });
    }
    this.loginUserName = "Test@test.com";
    this.isLoader = true;
 
    this.getUserName();
    this.getDataLevels();
    this.getDataFinanceCategories();
    this.getDataUsers();
    this.getTeams();
   
  }

  getUserName() {
    // this.service.getUserName().subscribe(res => {
    //   if (res != null && res !== "") {
        // const user = res as any;
        this.loginUserName ='veerender.kumar-e@maf.ae';// user.d.Email;
        // this.DisplayName ='Veerender Kumar';// user.d.Title;
        this.GetData(true, this.searchYear.controls["year"].value);
        // this.service.getEmployee(this.loginUserName).subscribe(response => {
          // if (response != null && response !== "") {
          //   const users = response as any;
          //   const c = users.d.results as [];
          //   if (c.length <= 0)
          //     this.router.navigateByUrl("/dashboard/Booking");
          // }
        // });
    //   }
    // });
  }

  saveData(poetForm: FormGroup) {
    let totalPercentage =
      poetForm.value.HoldingPercentage +
      poetForm.value.VenturesPercentage +
      poetForm.value.PropertiestPercentage +
      poetForm.value.RetailPercentage +
      poetForm.value.OtherPercentage;
      totalPercentage = Math.round(totalPercentage);
    if (totalPercentage == 100) {
      let isvalidpoet = false;
      if (this.poetMasterID > 0)
        isvalidpoet = true;
      else
        isvalidpoet = this.vaidatePoetNumber(poetForm);
      if (isvalidpoet) {
        const l2 = this.poetForm.controls["Level2"];
        if (this.vaidatePoetUsers(poetForm)) {
          this.GetObjectPoet(poetForm);
          this.saveDatatoDB(this.objPoetClass);
        } else {
          this.toastr.error(
            "Cannot be same Owner,Reviewer 1 and Reviewer 2",
            "Error Occured",
            {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: "decreasing",
              easeTime: 300
            }
          );
        }
      } else {
        this.toastr.error("POET Number already exists", "Error Occured", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          easeTime: 300
        });
      }
    }
    else {
      this.toastr.error("Total OPCO Percentage Should be 100", "Error Occured", {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: "decreasing",
        easeTime: 300
      });
    }
  }

  public changed(e: any): void { }

  vaidatePoetNumber(angForm: FormGroup) {
    let objLevel1 = [];
    objLevel1 = this.objPoets.filter(
      l => l.poetNumber == angForm.value.POETNumber
    );
    if (objLevel1 != null && objLevel1.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  getTeams() {
    this.service.getTeams().subscribe(res => {
      this.objTeams = res;
      const other: any[] = [];
      this.objTeams
        .map((item: { description: any; }) => {
          return {
            id: item.description,
            text: item.description
          };
        })
        .forEach((item: any) => other.push(item));
      this.TeamData = other;
    });
  }

  getPoetUserData() {
    this.user = new User();
    this.user.poet_master_id = this.poetMasterID;
    this.service.getPoetUserData(this.user).subscribe(res => {
      this.objPoetUserData = res as User[];;
    });
  }

  createFormUser() {
    this.signupForm = this.frmbuilder.group({
      SelectedUser: ["", Validators.required],
      SelectedTeam: ["", Validators.required],
      UserStartDate: ["", Validators.required],
      UserEndDate: new FormControl(false),
      UserEndDate1: []
    });
    const datepipe = new DatePipe("en-US");
    this.signupForm.controls["UserStartDate"].setValue(
      datepipe.transform(new Date(), "yyyy-MM-dd")
    );
    this.minDate = this.calendar.getToday();
    this.maxDate = { year: this.calendar.getToday().year, month: 12, day: 31 };
    this.signupForm.controls["UserStartDate"].disable();
    this.signupForm.controls["SelectedUser"].enable();
    this.signupForm.controls["SelectedTeam"].enable();
    this.signupForm.invalid == false;
    this.enableUserAdd = "Add User";
    this.enableUserEdit = false;
    this.poetUserID = 0;
  }

  vaidateUserNumber(signupForm: FormGroup) {
    let objLevel1 = [];
    if (this.objPoetUserData != null) {
      objLevel1 = this.objPoetUserData.filter(
        l => l.userName == signupForm.value.SelectedUser
      );
      if (objLevel1 != null && objLevel1.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  AddUsersToTable(signupForm: FormGroup) {
    if (this.vaidateUserNumber(signupForm)) {
      this.user = new User();
      this.user.userName = this.signupForm.value.SelectedUser;
      const datepipe = new DatePipe("en-US");
      if (this.signupForm.value.UserEndDate1 == null) {
      } else {
        this.user.endDate =
          this.signupForm.value.UserEndDate1.year +
          "-" +
          this.signupForm.value.UserEndDate1.month +
          "-" +
          this.signupForm.value.UserEndDate1.day;
      }
      this.user.teamName = this.signupForm.value.SelectedTeam;
      this.user.isActive = "true";
      if (this.poetMasterID > 0) {
        this.user.poet_master_id = this.poetMasterID;
      } else {
        this.user.poet_master_id = 0;
      }
      if (this.poetUserID > 0) {
        this.user.id = this.poetUserID;
        // this.user.startDate = this.signupForm.controls.UserStartDate.value;
      } else {
        this.user.id = 0;
        // this.user.startDate = datepipe.transform(new Date(), "yyyy-MM-dd");
      }
      const objUserName = this.dataUsers.filter(
        item => item.id == this.user.userName
      );

      this.user.userName = objUserName[0].text;
      this.user.emailId  = objUserName[0].id;
      this.objPoetUserData.push(this.user);
      this.signupForm.reset();
      this.enableUserAdd = "Add User";
      this.signupForm.controls["UserStartDate"].setValue(
        datepipe.transform(new Date(), "yyyy-MM-dd")
      );
      this.minDate = this.calendar.getToday();
      this.maxDate = {
        year: this.calendar.getToday().year,
        month: 12,
        day: 31
      };
      this.signupForm.controls["UserStartDate"].disable();
    } else {
      this.toastr.error("Failed", "User already exists", {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: "decreasing",
        easeTime: 300
      });
    }
  }

  vaidatePoetUsers(angForm: FormGroup) {
    /*const other = [];
    other.push(angForm.value.OwnerName);
    other.push(angForm.value.Reviewer1);
    other.push(angForm.value.Reviewer2);
    var uniqueValues = $.grep(other, function (v, k) {
      return $.inArray(v, other) == k;
    });
    if (uniqueValues.length !== other.length) {
      return false;
    } else {
      return true;
    }*/
    return true;
  }

  addUsertoPOET(user: User, poetid: number) {
    user.poet_master_id = poetid;
    if(user.id == 0) { 
        this.service.saveUserData(user).subscribe(res => {
        let result: any;
        result = res;
        return result;
      });
    }
  }

  GetObjectPoet(poetForm: FormGroup): PoetClass {
    this.objPoetClass = new PoetClass();
    this.objPoetClass.createdBy = this.loginUserName;
    this.objPoetClass.lastUpdateBy = this.loginUserName;
    this.objPoetClass.financialYear = poetForm.value.FiscalYear;
    this.objPoetClass.itemCategoryId = poetForm.value.FinanceCategory;
    const objFCategories = this.objFCategories.filter(
      (      item: { categoryId: any; }) => item.categoryId == poetForm.value.FinanceCategory
    );
    this.objPoetClass.itemCategoryName = objFCategories[0].categoryName;
    this.objPoetClass.level1 = poetForm.value.Level1;
    const level2Desc = this.objLevel2.filter(
      (      item: { flexValue: any; }) => item.flexValue == poetForm.value.Level2
    );
    this.objPoetClass.level2 = level2Desc[0].description;
    const level3Desc = this.objLevel3.filter(
      (      item: { flexValue: any; }) => item.flexValue == poetForm.value.Level3
    );
    this.objPoetClass.level3 = level3Desc[0].description;
    this.objPoetClass.level4 = poetForm.value.Level4;
    this.objPoetClass.ownerName = poetForm.value.OwnerName;
    this.objPoetClass.poetNumber = poetForm.value.POETNumber;
    this.objPoetClass.projectName = poetForm.value.ProjectName;
    this.objPoetClass.projectType = poetForm.value.ProjectType;
    this.objPoetClass.reviewer1 = poetForm.value.Reviewer1;
    this.objPoetClass.reviewer2 = poetForm.value.Reviewer2;
    this.objPoetClass.spendType = poetForm.value.FinanceCategoryType;
    this.objPoetClass.holdingPercentage = poetForm.value.HoldingPercentage;
    this.objPoetClass.venturesPercentage = poetForm.value.VenturesPercentage;
    this.objPoetClass.propertiesPercentage = poetForm.value.PropertiestPercentage;
    this.objPoetClass.retailPercentage = poetForm.value.RetailPercentage;
    this.objPoetClass.othersPercentage = poetForm.value.OtherPercentage;
    this.objPoetClass.chargeAccount = poetForm.value.ChargeAccount;
    this.objPoetClass.dummyPoet = poetForm.value.dummyPoetCheck;
    this.objPoetClass.futureSegment = poetForm.value.FutureSegment1;
    const datepipe = new DatePipe("en-US");
    // this.objPoetClass.startDate = datepipe.transform(new Date(), "yyyy-MM-dd"); // angForm.value.StartDate;
    if (poetForm.value.EndDate1 !== "" && poetForm.value.EndDate1 != null) {
      this.objPoetClass.endDate = poetForm.value.EndDate1.year + "-" +
        poetForm.value.EndDate1.month + "-" + poetForm.value.EndDate1.day;
    }


    if (this.poetMasterID > 0)
      this.objPoetClass.poetId = this.poetMasterID;
    else
      this.objPoetClass.poetId = 0;


    return this.objPoetClass;
  }

  saveDatatoDB(poetClass: PoetClass) {
    this.isLoader = true;
    this.modalService.dismissAll();
    this.service.savePoet(poetClass).subscribe(res => {
      let result: any;
      result = res;
      if (result.flag == true) {
        const poet = result.PoetItem;
        const poetid = poet.id;
        const table: any = $("#poetMaster").DataTable();
        table.destroy();
        this.objPoetUserData.forEach(item => this.addUsertoPOET(item, poetid));
        this.toastr.success("Success", "Saved data", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          easeTime: 300
        });
        this.poetForm.reset();
        this.modalService.dismissAll();
      } else {
        this.toastr.error(result, "Error Occured", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          easeTime: 300
        });
      }
      setTimeout(() => {
        this.isLoader = false;
        this.GetData(false, this.searchYear.controls["year"].value);
      }, 300);
    }),
      (      err: any) => {
        setTimeout(() => { 
          this.isLoader = false; 
          this.GetData(false, this.searchYear.controls["year"].value);
        }, 500);
        
      };
  }

  GetData(flag: boolean, year: string) {
    this.isLoader = true;
    this.service.getPoet(year, this.loginUserName).subscribe(res => {
      this.objPoets = [];
      if (!flag) {
        const table: any = $("#poetMaster").DataTable();
        table.destroy();
        this.chRef.detectChanges();
      }
      this.objPoets = res as PoetClass[];
      this.chRef.detectChanges();

      if (flag) {
        let ele1=$('#poetMaster thead tr') as JQuery<HTMLElement>;
        ele1.clone(true).appendTo('#poetMaster thead');
        let ele=$('#poetMaster thead tr:eq(0) th') as JQuery<HTMLElement>
        ele.each(function (i:any) {
          if (i !== 0) {
            var title = $(this).text();
            if (title === 'Edit') {
              $(this).html('');
            } else {
              $(this).html('<input type="text" placeholder="Search ' + title + '" />');
              $("input", this).on("keyup change", function (event:any) {
                if (table.column(i).search() !== event.target.value) {
                  table.column(i).search(event.target.value).draw();
                }
              });
            }
          }
        });
      }

      // if (flag) {
      //   $("#poetMaster thead tr")
      //     .clone(true)
      //     .appendTo("#poetMaster thead");
      //   $("#poetMaster thead tr:eq(0) th").each( (i: number) => {
      //     if (i !== 0) {
      //       const title = $(this).text();
      //       if (title == "Edit") {
      //         $(this).html("");
      //       } else if (i == 18 || i == 19 || i == 20 || i == 21 || i == 22) {
      //         $(this).html("");
      //       } else {
      //         $(this).html(
      //           '<input type="text" placeholder="Search ' + title + '" />'
      //         );
      //         $("input", this).on("keyup change", function () {
      //           // if (table.column(i).search() !== this.value) {
      //           //   table
      //           //     .column(i)
      //           //     .search(this.value)
      //           //     .draw();
      //           // }
      //         });
      //       }
      //     }
      //   });
      // }  

      // let ele=$("#poetMaster thead tr:eq(0) th") as JQuery<HTMLElement>;
      // ele.each(function (i:any) {
      //   $("input", this).on("keyup change",  (event:any)=> {
      //     if (table.column(i).search() !== event.target.value) {
      //       table.column(i).search(event.target.value).draw();
      //     }
      //   });
      // });
      let table = $("#poetMaster").DataTable({
        dom: "Blfrtip",
        pageLength: 100,
        destroy: true,
        paging: false,
        order: [[1, "desc"]],
        buttons: [
          {
            extend: "excelHtml5",
            className: "btn hide",
            titleAttr: "Export in Excel",
            text: "Excel",
            init: function (api: any, node: any, config: any) {
              $(node).removeClass("btn-default");
            }
          }
        ]
      });
      setTimeout(() => { this.isLoader = false; }, 500);
    }),
      (      err: any) => {
        setTimeout(() => { this.isLoader = false; }, 500);
      };
  }

  fnAction() {
    // $(".buttons-excel").trigger("click");
    this.datas = [];
    this.objPoets.forEach((item:any) => {
      let data = {
        'Year': item.financialYear,
        'Project Name':item.projectName,
        'Poet Number': item.poetNumber,
        'Project Cateogry':item.projectCategory,
        'L1': item.level1,
        'L2': item.level2,
        'L3': item.level3,
        'L4': item.level4,
        'Project Type': item.projectType,
        'Finance Category': item.itemCategoryName,
        // 'Difference': this.getDifference(item, ' '),
        'Finance Category Type': item.spendType,
        'Charge Account': item.chargeAccount,
        'Owner Name': item.ownerKnownName,
        'Reviewer 1': item.reviewer1Name,
        'Reviewer 2': item.reviewer2Name,
        'Start Date': item.startDate,
        'End Date': item.endDate,
        'Holding %': item.holdingPercentage,
        'Ventures %': item.venturesPercentage,
        'Properties %': item.propertiesPercentage,
        'Retail %': item.retailPercentage,
        'Others %': item.othersPercentage,
        // 'Total': this.getTotal(item, ' ')
      };
      this.datas.push(data);
    });
    this.excelService.exportAsExcelFile(this.datas, 'Budget Setup');
  }

  fnVisible() {
    $(".buttons-colvis").trigger("click");
  }

  public handleRefusalData(dismissMethod: Event): void {
    // dismissMethod can be 'cancel', 'overlay', 'close', and 'timer'
    // ... do something
  }

  selected(event: any) {
    alert();
  }

  getDataLevels() {
    this.service.getMasterData().subscribe(res => {
      this.objLevels = res;
      this.objLevel1 = this.objLevels.filter(
        (        l: { parentValue: string; }) => l.parentValue == "XXMAFH_BUDGET_TRACKER_LEVEL1"
      );
      this.objLevel2 = this.objLevels.filter(
        (        l: { parentValue: string; }) => l.parentValue == "XXMAFH_BUDGET_TRACKER_LEVEL2"
      );
      this.objLevel3 = this.objLevels.filter(
        (        l: { parentValue: string; }) => l.parentValue == "XXMAFH_BUDGET_TRACKER_LEVEL3"
      );
      this.objLevel4 = this.objLevels.filter(
        (        l: { parentValue: string; }) => l.parentValue == "XXMAFH_BUDGET_TRACKER_LEVEL4"
      );
      this.objLevel2Data = this.objLevel2;
      this.objLevel3Data = this.objLevel3;
      this.objLevel4Data = this.objLevel4;
    })
  }

  getDataFinanceCategories() {
    this.service.getFinanceCategories().subscribe(res => {
      this.objFCategories = res;
      const other: any[] = [];
      this.objFCategories
        .map((item: { categoryId: any; categoryName: any; }) => {
          return {
            id: item.categoryId,
            text: item.categoryName
          };
        })
        .forEach((item: any) => other.push(item));
      this.dataFCategory = other;
    })
  }

  getDataUsers() {
    debugger;
    this.service.getUsers().subscribe(res => {
      this.objUsers = res;
      const other: any[] = [];
      this.objUsers
        .map((item: { emailAddress: string; fullName: any; }) => {
          return {
            id: item.emailAddress.toLowerCase(),
            text: item.fullName
          };
        })
        .forEach((item: any) => other.push(item));
      this.dataUsers = other;
    });
  }

  createPoetForm() {
    this.modaltitle = "Create New POET Master Data";
    this.poetMasterID = 0;
    this.poetForm = this.fb.group({
      FiscalYear: ["", Validators.required],
      Level1: ["", Validators.required],
      Level2: ["", Validators.required],
      Level3: ["", Validators.required],
      Level4: ["", Validators.required],
      ProjectName: ["", Validators.required],
      FutureSegment1 : ["", Validators.required],
      ChargeAccount  : ["", Validators.required],
      ProjectType: ["", Validators.required],
      POETNumber: ["", Validators.required],
      FinanceCategory: ["", Validators.required],
      FinanceCategoryType: ["Opex", Validators.required],
      OwnerName: ["", Validators.required],
      Reviewer1: ["", Validators.required],
      Reviewer2: ["", Validators.required],
      StartDate: ["", Validators.required],
      EndDate: [""],
      EndDate1: [],
      dummyPoetCheck: [false],
      HoldingPercentage: [0],
      VenturesPercentage: [0],
      PropertiestPercentage: [0],
      RetailPercentage: [0],
      OtherPercentage: [0]
    });
    const year = new Date().getFullYear();
    this.poetForm.controls["FiscalYear"].setValue(year);
    const datepipe = new DatePipe("en-US");
    this.poetForm.controls["StartDate"].setValue(
      datepipe.transform(new Date(), "yyyy-MM-dd")
    );
    this.minDate = this.calendar.getToday();
    this.poetForm.controls["HoldingPercentage"].setValue(0);
    this.poetForm.controls["VenturesPercentage"].setValue(0);
    this.poetForm.controls["PropertiestPercentage"].setValue(0);
    this.poetForm.controls["RetailPercentage"].setValue(0);
    this.poetForm.controls["OtherPercentage"].setValue(0);
  }

  onChangeLevel1(selectedValue: any) {
    this.objLevel2Data = this.objLevel2;
  }

  onChangeFinance(args: { target: { options: { [x: string]: { text: string; }; }; selectedIndex: string | number; }; }) {
    this.FCdesc = args.target.options[args.target.selectedIndex].text;
  }

  onChangeLevel2(args:any) {
    this.level2Desc = args.target.options[args.target.selectedIndex].text;
    this.objLevel3Data = this.objLevel3.filter(
      (      item: { parentValue: string; }) => item.parentValue == "XXMAFH_BUDGET_TRACKER_LEVEL3"
    );
  }


  public changedYear(e: any): void {
    debugger;
    if(e != undefined)
    {
    this.GetData(false, e.text);
    }
  }

  onChangeLevel3(args: { target: { options: { [x: string]: { text: string; }; }; selectedIndex: string | number; }; }) {
    this.level3Desc = args.target.options[args.target.selectedIndex].text;
    this.objLevel4Data = this.objLevel4.filter(
      (      item: { parentValue: string; }) => item.parentValue == "XXMAFH_BUDGET_TRACKER_LEVEL4"
    );
  }

  open(content: any) {
    this.createPoetForm();
    this.createFormUser();
    const objPoetUser: User[] = [];
    this.objPoetUserData = objPoetUser;
    this.modalService.open(content, { size: "lg", centered: true });
  }

  editPoet(poet: any, content: any) {
    this.createPoetForm();
    this.modaltitle = "Update POET Master Data";
    this.poetMasterID = poet.poetId;
    this.poetForm.controls["FiscalYear"].setValue(poet.financialYear);
    this.poetForm.controls["Level1"].setValue(poet.level1);
    this.poetForm.controls["Level2"].setValue(poet.level2);
    this.poetForm.controls["Level3"].setValue(poet.level3);
    this.poetForm.controls["Level4"].setValue(poet.level4);
    this.poetForm.controls["ProjectName"].setValue(poet.projectName);
    this.poetForm.controls["FutureSegment1"].setValue(poet.futureSegment1)
    this.poetForm.controls["ProjectType"].setValue(poet.projectType);
    this.poetForm.controls["POETNumber"].setValue(poet.poetNumber);
    this.poetForm.controls["FinanceCategory"].setValue(poet.itemCategoryId);
    this.poetForm.controls["FutureSegment1"].setValue(poet.future1Segment);
    this.poetForm.controls["ChargeAccount"].setValue(poet.chargeAccount);
    this.poetForm.controls["OwnerName"].setValue(poet.ownerName.toLowerCase());
    this.poetForm.controls["Reviewer1"].setValue(poet.reviewer1.toLowerCase());
    this.poetForm.controls["Reviewer2"].setValue(poet.reviewer2.toLowerCase());
    const datepipe = new DatePipe("en-US");
    this.poetForm.controls["StartDate"].setValue(datepipe.transform(poet.startDate, "yyyy-MM-dd"));
    this.poetForm.controls["HoldingPercentage"].setValue(poet.holdingPercentage);
    this.poetForm.controls["VenturesPercentage"].setValue(poet.venturesPercentage);
    this.poetForm.controls["PropertiestPercentage"].setValue(poet.propertiesPercentage);
    this.poetForm.controls["RetailPercentage"].setValue(poet.retailPercentage);
    this.poetForm.controls["OtherPercentage"].setValue(poet.othersPercentage);
    if (poet.endDate !== "" && poet.endDate != null) {
      const datepipe = new DatePipe("en-US");
      const transformedDate = datepipe.transform(new Date(poet.endDate), "yyyy-MM-dd");
    
      if (transformedDate) {
        const [yy, mm, dd] = transformedDate.split("-").map(Number);
        this.poetForm.controls["EndDate1"].setValue({ year: yy, month: mm, day: dd });
      } else {
        console.error("Failed to transform the date:", poet.endDate);
        // Handle the fallback scenario if needed
      }
    }
    this.poetForm.controls["FinanceCategoryType"].setValue(poet.spendType);
    this.dummyCheckBox= poet.dummyPoet;
    this.getPoetUserData();
    this.modalService.open(content, { size: "lg", centered: true });
  }

  editPoetUser(poet: { id: number; startDate: string | number | Date; userName: string; teamName: string; }) {
    this.createFormUser();
    this.enableUserAdd = "Update User";
    this.enableUserEdit = true;
    this.poetUserID = poet.id;
    const datepipe = new DatePipe("en-US");
    const date = datepipe.transform(new Date(poet.startDate), "yyyy-MM-dd");
    this.signupForm.controls["UserStartDate"].setValue(date);
    this.signupForm.controls["SelectedUser"].setValue(poet.userName.toLowerCase());
    this.signupForm.controls["SelectedTeam"].setValue(poet.teamName);
    const index = this.objPoetUserData.findIndex(
      user =>
        user.id == poet.id &&
        user.userName == poet.userName &&
        user.teamName == poet.teamName
    );
    this.objPoetUserData.splice(index, 1);
  }

  deletePoetUser(poet: User) {
    this.isLoader = true;
    this.service.deleteUserData(poet).subscribe(res => {
      this.objPoetUserData = [];
      this.getPoetUserData();
      setTimeout(() => { this.isLoader = false; }, 500);
    }),
      (      err: any) => {
        setTimeout(() => { this.isLoader = false; }, 500);
      };
  }
}
