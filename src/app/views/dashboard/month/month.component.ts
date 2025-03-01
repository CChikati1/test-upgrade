import {
  Component,
  OnInit,
  AfterViewInit,
  Injectable,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModalConfig,
  NgbModal,
  NgbDateStruct,
  NgbCalendar,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  NgForm,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule, DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Select2OptionData } from 'ng-select2';
import { ChangeDetectionStrategy } from '@angular/core';
import { MonthClass } from '../MonthClass';
import { DataTableDirective,DataTablesModule } from 'angular-datatables';
import { ExcelService } from '../../../excel.service';
import { AccordionModule } from '@coreui/angular';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SweetAlert2LoaderService, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { HighchartsChartModule } from 'highcharts-angular';



declare const $:any;
@Component({
  selector: 'app-month',
  standalone: true,
  imports: [DecimalPipe,AccordionModule,
    TabsModule,SweetAlert2Module,NgSelectModule,ReactiveFormsModule,
    HighchartsChartModule,CommonModule,FormsModule,NgbModule,DataTablesModule ],
  templateUrl: './month.component.html',
  styleUrl: './month.component.scss',
  providers:[ApiService,ExcelService,ToastrService,NgbModalConfig, NgbModal, {provide:SweetAlert2LoaderService,useClass:SweetAlert2LoaderService } ],
})
export class MonthComponent implements OnInit,AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  private datatableElement: DataTableDirective;
  dataTable: any;
  public dataYear: Array<Select2OptionData>;
  objMonthClass: MonthClass;
  objMonthClassList: MonthClass[];
  angForm: FormGroup;
  searchYear: FormGroup;
  date: { year: number; month: number };
  model: NgbDateStruct;
  minDate = {};
  objLevels: any;
  objLevel1: any;
  objLevel2: any;
  objLevel3: any;
  objLevel4: any;
  objUsers: any;
  objPoets: any;
  objMonthPoets: any;
  objFCategories: any;
  objLevel2Data: any;
  objLevel3Data: any;
  objLevel4Data: any;
  level2Desc: string;
  level3Desc: string;
  FCdesc: string;
  objProjects: any;
  objPoetNumbers: any;
  public dataProjects: Array<Select2OptionData>;
  public dataPOETNumber: Array<Select2OptionData>;
  modaltitle: string;
  monthPoetMasterID: number;
  dtOptions: any = {};
  isLoader: boolean;
  loginUserName: string ;
  datas: any = [];
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private toastr: ToastrService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private service: ApiService,
    private excelService: ExcelService
  ) {
    let items:any = [];
    items.push({ id: '2019', text: '2019' });
    items.push({ id: '2020', text: '2020' });
    items.push({ id: '2021', text: '2021' });
    items.push({ id: '2022', text: '2022' });
    items.push({ id: '2023', text: '2023' });
    items.push({ id: '2024', text: '2024' });
items.push({ id: '2025', text: '2025' })
    this.dataYear = items;
    config.backdrop = 'static';
    config.keyboard = false;
    this.createForm();
    this.searchYear = this.fb.group({
      year: ["2024"]
    });
    this.searchYear.controls["year"].setValue("2024");
  }

  // displayToConsole(datatableElement: DataTableDirective): void {
  //   datatableElement.dtInstance.then((dtInstance: DataTables.Api) =>
  //     console.log(dtInstance)
  //   );
  // }
  ngAfterViewInit() {
    if(isPlatformBrowser(this.platformId)){
    import('jquery').then((jQueryModule) => {
      const $=jQueryModule.default;
      $('a').removeClass('liactive');
     $('.liMonth').addClass('liactive');
      // jQuery is now available for use in the browser
    });
  }
  }
  ngOnInit() {
    
    if (isPlatformBrowser(this.platformId)) {
      import('jquery').then((jQueryModule) => {
        const $=jQueryModule.default;
        $('a').removeClass('liactive');
       $('.liMonth').addClass('liactive');
      
        // jQuery is now available for use in the browser
      }).catch((err) => {
        console.error('Error loading jQuery:', err);
      });;
      
     
    }
    if (typeof window !== 'undefined') {
      // Browser-specific code
      (window as any).jQuery = $;
      (window as any).$ = $;
    }
    this.isLoader = true;
    
    this.getUserName();
  }

  saveData(angForm: NgForm) {
    let isvalidpoet = false;
    isvalidpoet = this.vaidatePoetNumber(angForm);
    if (isvalidpoet) {
      this.GetMonthPoeItem(angForm);
      this.saveDatatoDB(this.objMonthClass);
    } else {
      this.toastr.error(
        'Monthly budget already allocated for this POET Number',
        'Error Occured',
        {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
          easeTime: 300
        }
      );
    }
  }

  vaidatePoetNumber(angForm: any) {
    let objLevel1 = [];
    objLevel1 = this.objMonthPoets.filter(
      (l:any) =>
        l.POET_NUMBER === angForm.POETNumber &&
        l.M_HEADER_ID !== this.monthPoetMasterID
    );
    if (objLevel1 != null && objLevel1.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  GetMonthPoeItem(angForm: any): MonthClass {
    this.objMonthClass = new MonthClass();
    this.objMonthClass.createdBy = this.loginUserName;
    this.objMonthClass.lastUpdateBy = this.loginUserName;
    this.objMonthClass.financialYear = angForm.FiscalYear;
    this.objMonthClass.janBudget = angForm.January;
    this.objMonthClass.febBudget = angForm.February;
    this.objMonthClass.marBudget = angForm.March;
    this.objMonthClass.aprBudget = angForm.April;
    this.objMonthClass.mayBudget = angForm.May;
    this.objMonthClass.junBudget = angForm.June;
    this.objMonthClass.julBudget = angForm.July;
    this.objMonthClass.augBudget = angForm.August;
    this.objMonthClass.sepBudget = angForm.September;
    this.objMonthClass.octBudget = angForm.October;
    this.objMonthClass.novBudget = angForm.November;
    this.objMonthClass.decBudget = angForm.December;
    this.objMonthClass.Total = angForm.Total;
    this.objMonthClass.financialBudget = angForm.YearlyBudget;
    this.objMonthClass.yearlyBudget = angForm.YearlyBudget;    
    let objLevel1 = [];
    objLevel1 = this.objPoets.filter((l:any) => l.poetId == this.angForm.value.POETNumber);
    this.objMonthClass.projectName = objLevel1[0].projectName;    
    this.objMonthClass.poetNumber = objLevel1[0].poetNumber;
    this.objMonthClass.poetId =  objLevel1[0].poetId;
    if (this.monthPoetMasterID > 0) {
      this.objMonthClass.id = this.monthPoetMasterID;
    } else {
      this.objMonthClass.id = 0;
    }
    return this.objMonthClass;
  }

  saveDatatoDB(monthClass: MonthClass) {
    this.service.saveMonthwisePoet(monthClass).subscribe(res => {
      let result: any;
      result = res;
      if (result === true) {
        if (this.monthPoetMasterID > 0) {
          this.toastr.success('Success', 'Updated data', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'decreasing',
            easeTime: 300
          });
        } else {
          this.toastr.success('Success', 'Saved data', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'decreasing',
            easeTime: 300
          });
        }
        this.modalService.dismissAll();
        this.angForm.reset();
        const table: any = $("#monthTable").DataTable();
        table.destroy();
        this.chRef.detectChanges();
        setTimeout(() => {
          this.isLoader = false; 
          this.GetMonthPoetData(false, this.searchYear.controls["year"].value);
        }, 500);
      } else {
        this.toastr.error(result, 'Error Occured', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
          easeTime: 300
        });
      }
    });
  }

  editPoet(Monthpoet:any, content:any) {
    this.createForm();
    this.modaltitle = 'Update Monthwise Spent Schedule';
    this.monthPoetMasterID = Monthpoet.headerId;
    this.angForm.controls['FiscalYear'].setValue(Monthpoet.fyYear);
    this.angForm.controls['Level1'].setValue(Monthpoet.level1);
    this.angForm.controls['Level2'].setValue(Monthpoet.level2);
    this.angForm.controls['Level3'].setValue(Monthpoet.level3);
    this.angForm.controls['Level4'].setValue(Monthpoet.level4);
    const selectedProject = this.dataProjects.find(
      (project) => project.text === Monthpoet.projectName
    );
    if (selectedProject) {
      this.angForm.controls['ProjectName'].setValue(selectedProject.id);
    }
    const selectedPoetNumber = this.dataPOETNumber.find(
      (project) => project.text.toString() == Monthpoet.poetNumber
    );
    if (selectedPoetNumber) {
      this.angForm.controls['POETNumber'].setValue(selectedPoetNumber.id);
    }
    //this.angForm.controls['ProjectName'].setValue(Monthpoet.projectName); //poetId
   // this.angForm.controls['POETNumber'].setValue(Monthpoet.poetNumber);   //poetId
    //this.angForm.controls['AvailableBudget'].setValue(Monthpoet.fyBudget);
    this.angForm.controls['YearlyBudget'].setValue(Monthpoet.yearlyBudget);
    this.angForm.controls['Difference'].setValue(this.getDifference(Monthpoet, content));
    this.angForm.controls['Total'].setValue(this.getTotal(Monthpoet, content));
    this.angForm.controls['January'].setValue(Monthpoet.janBudget.toFixed(2));
    this.angForm.controls['February'].setValue(Monthpoet.febBudget.toFixed(2));
    this.angForm.controls['March'].setValue(Monthpoet.marBudget.toFixed(2));
    this.angForm.controls['April'].setValue(Monthpoet.aprBudget.toFixed(2));
    this.angForm.controls['May'].setValue(Monthpoet.mayBudget.toFixed(2));
    this.angForm.controls['June'].setValue(Monthpoet.junBudget.toFixed(2));
    this.angForm.controls['July'].setValue(Monthpoet.julBudget.toFixed(2));
    this.angForm.controls['August'].setValue(Monthpoet.augBudget.toFixed(2));
    this.angForm.controls['September'].setValue(Monthpoet.sepBudget.toFixed(2));
    this.angForm.controls['October'].setValue(Monthpoet.octBudget.toFixed(2));
    this.angForm.controls['November'].setValue(Monthpoet.novBudget.toFixed(2));
    this.angForm.controls['December'].setValue(Monthpoet.decBudget.toFixed(2));
    this.modalService.open(content, { size: 'lg', centered: true,backdrop:false });
    this.chRef.detectChanges();
  }

  GetData(year: String) {
    
    this.service.getPoet(year, this.loginUserName.toLowerCase()).subscribe(res => {
      this.objPoets = res;
      const other:any = [];
      const projects:any = [];
      this.objPoets
        .map((item:any) => { return { id: item.poetId, text: item.poetNumber }; })
        .forEach((item:any) => other.push(item));
      this.objPoetNumbers = other;
      this.dataPOETNumber = other;
      this.objPoets
        .map((item:any) => { return { id: item.poetId, text: item.projectName }; })
        .forEach((item:any) => projects.push(item));
      this.objProjects = projects;
      this.dataProjects = projects;
      setTimeout(() => { this.isLoader = false; }, 500);
    }),
      (err:any) => {
        setTimeout(() => { this.isLoader = false; }, 500);
      };
  }

  public changedYear(e: any): void {
    this.GetData(e.text);
    const table: any = $("#monthTable").DataTable();
    table.destroy();
    this.chRef.detectChanges();
    this.GetMonthPoetData(false, e.text);
  }


  getUserName() {
    this.service.getUserName().subscribe(res => {
      if (res != null && res !== '') {
        const user = res as any;
        this.loginUserName = user.d.Email; //'veerender.kumar-e@maf.ae';
        this.GetData(this.searchYear.controls["year"].value);
        this.GetMonthPoetData(true, this.searchYear.controls["year"].value);
        this.service.getEmployee(this.loginUserName).subscribe(resposne => {
          if (resposne != null && resposne !== '') {
            const users = resposne as any;
            const c = users.d.results as [];
            if (c.length <= 0) {
             this.router.navigateByUrl('/dashboard/Booking');
            }
          }
        });
      }
     });
  }

  GetMonthPoetData(flag: boolean, year: string) {
    this.isLoader = true
    this.service.getMonthwisePoet(year, this.loginUserName.toLowerCase()).subscribe(res => {
      this.objMonthPoets = res;
      this.chRef.detectChanges();
      //this.objMonthPoets = [];
     
      const existingTable:any = $("#monthTable").DataTable();
      if (existingTable) {
        existingTable.destroy();
      }
      if (flag) {
        let ele1=$('#monthTable thead tr') as JQuery<HTMLElement>;
        ele1.clone(true).appendTo('#monthTable thead');
        let ele=$('#monthTable thead tr:eq(0) th') as JQuery<HTMLElement>
        ele.each(function (i:any) {
          if (i !== 0) {
            var title = $(this).text();
            if (title === 'Edit') {
              $(this).html('');
            } else {
              $(this).html('<input type="text" placeholder="Search ' + title + '" />');
              $("input", this).on("keyup change", function (event:any) {
                const table = $("#monthTable").DataTable();
                if (table.column(i).search() !== event.target.value) {
                  table.column(i).search(event.target.value).draw();
                }
              });
            }
          }
        });
      }
       $("#monthTable").DataTable({
        dom: "Blfrtip",
        destroy: true,
        pageLength: 100,
        paging: false,
        order: [[1, "desc"]],
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
        ]
      });
      this.chRef.detectChanges();
    });
    //this.isLoader =false;
  }

  fnAction(): void {
    //$(".buttons-excel").trigger("click");
    this.datas = [];
    this.objMonthPoets.forEach((item:any) => {
      let data = {
        'Year': item.fyYear,
        'Poet Number': item.poetNumber,
        'L1': item.level1,
        'L2': item.level2,
        'L3': item.level3,
        'L4': item.level4,
        'Available System Budget': item.fyBudget,
        'Yearly Budget': item.yearlyBudget,
        'Difference': this.getDifference(item, ' '),
        'January': item.janBudget,
        'Feburary': item.febBudget,
        'March': item.marBudget,
        'April': item.aprBudget,
        'May': item.mayBudget,
        'June': item.junBudget,
        'July': item.julBudget,
        'August': item.augBudget,
        'September': item.sepBudget,
        'October': item.octBudget,
        'November': item.novBudget,
        'December': item.decBudget,
        'Total': this.getTotal(item, ' ')
      };
      this.datas.push(data);
    });
    this.excelService.exportAsExcelFile(this.datas, 'Budget Schedule');
  }

  public handleRefusalData(dismissMethod: Event): void {
  }

  createForm() {
    this.modaltitle = 'Create Monthwise Spent Schedule';
    this.monthPoetMasterID = 0;
    this.angForm = this.fb.group({
      FiscalYear: ['', Validators.required],
      Level1: ['', Validators.required],
      Level2: ['', Validators.required],
      Level3: ['', Validators.required],
      Level4: ['', Validators.required],
      ProjectName: ['', Validators.required],
      POETNumber: ['', Validators.required],
      //AvailableBudget: ['120000', Validators.required],
      YearlyBudget: ['', Validators.required],
      Difference: ['', Validators.required],
      January: ['', Validators.required],
      February: ['', Validators.required],
      March: ['', Validators.required],
      April: ['', Validators.required],
      May: ['', Validators.required],
      June: ['', Validators.required],
      July: ['', Validators.required],
      August: ['', Validators.required],
      September: ['', Validators.required],
      October: ['', Validators.required],
      November: ['', Validators.required],
      December: ['', Validators.required],
      Total: ['', Validators.required]
    });
    const year = new Date().getFullYear();
    this.angForm.controls['FiscalYear'].setValue(year);
  }

  onChangeNumber(angForm: FormGroup<any>) {
    let budgetSum: any = 0;
    if (angForm.value.January !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.January);
    }
    if (angForm.value.February !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.February);
    }
    if (angForm.value.March !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.March);
    }
    if (angForm.value.April !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.April);
    }
    if (angForm.value.May !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.May);
    }
    if (angForm.value.June !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.June);
    }
    if (angForm.value.July !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.July);
    }
    if (angForm.value.August !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.August);
    }
    if (angForm.value.September !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.September);
    }
    if (angForm.value.October !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.October);
    }
    if (angForm.value.November !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.November);
    }
    if (angForm.value.December !== '') {
      budgetSum = budgetSum + parseFloat(angForm.value.December);
    }
    this.angForm.controls['Total'].setValue(budgetSum.toFixed(2));
    this.angForm.controls['Difference'].setValue(
      (
        parseFloat(angForm.value.YearlyBudget) - budgetSum.toFixed(2)
      ).toFixed(2)
    );
  }

  getTotal(Monthpoet:any, content:any) {
    let sum: any = 0;
    sum += parseFloat(Monthpoet.janBudget.toFixed(2));
    sum += parseFloat(Monthpoet.febBudget.toFixed(2));
    sum += parseFloat(Monthpoet.marBudget.toFixed(2));
    sum += parseFloat(Monthpoet.aprBudget.toFixed(2));
    sum += parseFloat(Monthpoet.mayBudget.toFixed(2));
    sum += parseFloat(Monthpoet.junBudget.toFixed(2));
    sum += parseFloat(Monthpoet.julBudget.toFixed(2));
    sum += parseFloat(Monthpoet.augBudget.toFixed(2));
    sum += parseFloat(Monthpoet.sepBudget.toFixed(2));
    sum += parseFloat(Monthpoet.octBudget.toFixed(2));
    sum += parseFloat(Monthpoet.novBudget.toFixed(2));
    sum += parseFloat(Monthpoet.decBudget.toFixed(2));
    return sum.toFixed(2);
  }
  getDifference(Monthpoet:any, content:any) {
    let sum: any = 0;
    sum += parseFloat(Monthpoet.janBudget.toFixed(2));
    sum += parseFloat(Monthpoet.febBudget.toFixed(2));
    sum += parseFloat(Monthpoet.marBudget.toFixed(2));
    sum += parseFloat(Monthpoet.aprBudget.toFixed(2));
    sum += parseFloat(Monthpoet.mayBudget.toFixed(2));
    sum += parseFloat(Monthpoet.junBudget.toFixed(2));
    sum += parseFloat(Monthpoet.julBudget.toFixed(2));
    sum += parseFloat(Monthpoet.augBudget.toFixed(2));
    sum += parseFloat(Monthpoet.sepBudget.toFixed(2));
    sum += parseFloat(Monthpoet.octBudget.toFixed(2));
    sum += parseFloat(Monthpoet.novBudget.toFixed(2));
    sum += parseFloat(Monthpoet.decBudget.toFixed(2));
    sum = parseFloat(Monthpoet.fyBudget) - sum.toFixed(2);
    return sum.toFixed(2);
  }

  onChangePoetNumber(args:any) {
    this.FCdesc = args.target.options[args.target.selectedIndex].text;
    let objLevel1 = [];
    objLevel1 = this.objPoets.filter(
      (l:any) => l.poetNumber === this.angForm.value.POETNumber
    );
    if (objLevel1 != null && objLevel1.length > 0) {
      this.angForm.controls['Level1'].setValue(objLevel1[0].level1);
      this.angForm.controls['Level2'].setValue(objLevel1[0].level2);
      this.angForm.controls['Level3'].setValue(objLevel1[0].level3);
      this.angForm.controls['Level4'].setValue(objLevel1[0].level4);
      this.angForm.controls['ProjectName'].setValue(objLevel1[0].projectName);
    }
  }

  public changedPoet(e: any): void {
    this.angForm.controls['POETNumber'].setValue(e.id);
    this.FCdesc = e.text;
    let objLevel1 = [];
    objLevel1 = this.objPoets.filter((l:any) => l.poetId == this.angForm.value.POETNumber);
    if (objLevel1 != null && objLevel1.length > 0) {
      this.angForm.controls['Level1'].setValue(objLevel1[0].level1);
      this.angForm.controls['Level2'].setValue(objLevel1[0].level2);
      this.angForm.controls['Level3'].setValue(objLevel1[0].level3);
      this.angForm.controls['Level4'].setValue(objLevel1[0].level4);
      this.angForm.controls['ProjectName'].setValue(objLevel1[0].poetId);
    }
    this.chRef.detectChanges();
  }

  public changedProject(e: any): void {
    this.angForm.controls['ProjectName'].setValue(e.id);
    this.FCdesc = e.text;
    let objLevel1 = [];
    objLevel1 = this.objPoets.filter((l:any) => l.poetId == this.angForm.value.ProjectName);
    if (objLevel1 != null && objLevel1.length > 0) {
      this.angForm.controls['Level1'].setValue(objLevel1[0].level1);
      this.angForm.controls['Level2'].setValue(objLevel1[0].level2);
      this.angForm.controls['Level3'].setValue(objLevel1[0].level3);
      this.angForm.controls['Level4'].setValue(objLevel1[0].level4);
      this.angForm.controls['POETNumber'].setValue(objLevel1[0].poetId);
    }
  }

  open(content:any) {
    this.createForm();
    this.modalService.open(content, { size: 'lg', centered: true,backdrop:false });
  }
}

