import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, SecurityContext, Inject, PLATFORM_ID, Pipe, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModalConfig, NgbModal, NgbDateStruct, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators, NgForm, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule, DatePipe, DecimalPipe, isPlatformBrowser } from "@angular/common";
import { ApiService } from "../../../api.service";
import { ToastrService } from "ngx-toastr";
import { Select2OptionData } from "ng-select2";
import { BudgetBooking, Vendor, VendorSite, VendorSiteDetails, BudgetPoetNumber, BudgetAmount, BudgetPoetId, BudgetAttachment, DeleteBudgetBooking, travelPoet } from "../budgetBookingClass";
import { BudgetBookingLines, updateAttachement } from "../budgetBookingClass";
import { CurrencyRate } from "../budgetBookingClass";
import { DataTableDirective,DataTablesModule } from "angular-datatables";
import { PoetClass } from "../PoetClass";
import { DomSanitizer } from '@angular/platform-browser';
import { AccordionModule } from "@coreui/angular";
import { TabsModule } from "ngx-bootstrap/tabs";
import { SweetAlert2LoaderService,SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgSelectModule } from "@ng-select/ng-select";
import { HighchartsChartModule } from "highcharts-angular";
import { ExcelService } from "../../../excel.service";
import { NgbdDatepickerPopup} from '../datepicker-popup';
import { TooltipModule  } from 'ngx-bootstrap/tooltip';



declare const $:any;
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [DecimalPipe,AccordionModule,DatePipe,
    TabsModule,SweetAlert2Module, NgSelectModule,ReactiveFormsModule,
    HighchartsChartModule,CommonModule,FormsModule,NgbModule,TooltipModule,DataTablesModule],
  templateUrl: './booking.component.html',
  providers:[ApiService,ExcelService,ToastrService,NgbModalConfig,NgbdDatepickerPopup, NgbModal, {provide:SweetAlert2LoaderService,useClass:SweetAlert2LoaderService }],
  styleUrl: './booking.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class BookingComponent {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private assetInputElRef: ElementRef;
  @ViewChild("assetInput") set assetInput(elRef: ElementRef) {
    this.assetInputElRef = elRef;
  }


  private datatableElement: DataTableDirective;
  dataTable: any;
  objBudgetBooking: BudgetBooking;
  DummyPoets: BudgetBooking[];
  bbfForm: FormGroup;
  additionalInfoForm: FormGroup;
  searchYear: FormGroup;
  date: { year: number; month: number };
  model: NgbDateStruct;
  minDate: NgbDateStruct;
  objLevels: any;
  objLevel1: any;
  objLevel2: any;
  objLevel3: any;
  objLevel4: any;
  objUsers: any;
  objCurrency: any;
  objCurrencyRate: CurrencyRate;
  public objPoets: BudgetBooking[] = [];
  public objAccPoets: PoetClass[] = [];
  objFCategories: any;
  objLevel2Data: any;
  objLevel3Data: any;
  objLevel4Data: any;
  level2Desc: string;
  level3Desc: string;
  FCdesc: string;
  lineAmount: number;
  bbLinesForm: FormGroup;
  public dataUsers: Array<Select2OptionData>;
  public dataCurrency: Array<Select2OptionData>;
  public dataProjects: Array<Select2OptionData>;
  public dataPOETNumber: Array<Select2OptionData>;
  public dataVendor: Array<Select2OptionData>;
  public dataVendorSite: Array<Select2OptionData>;
  public dataFCategory: Array<Select2OptionData>;
  dtOptions: any = {};
  maxDate = {};
  objBudgetBookingLines: BudgetBookingLines;
  enableUserAdd = "Add BudgetBookingLines";
  enableUserEdit = false;
  selectedCurreny: string;
  fileURL: string;
  dummyCheckBox: boolean = false;
  objTeams: any;
  public objPoetUserData: BudgetBookingLines[] = [];
  public objPoetStatusData: any = [];
  public exampleData: Array<Select2OptionData>;
  public TeamData: Array<Select2OptionData>;
  modaltitle: string;
  bookingMasterID: number;
  BBFtotalAmount: number;
  poetUserID: number;
  percentDone: number;
  uploadSuccess: boolean;
  public objBudgetAttachments: any = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isUser: boolean = false;
  LastpoetID: number;
  isonint = true;
  isLoader: boolean;
  totalBBFAmount: number = 0;
  isBtnEnabled: boolean = true;
  applybtnEnabled: boolean = true;
  isBtnLater: boolean = true;
  isBtnSave: boolean = false;
  isUploadEnabled: boolean = false;
  isSubmitDisabled: boolean = true;
  private imageSrc: string = "";
  loginUserName: string = "Test@test.com";
  travelPoet: boolean = false;
  tavelPoetData: travelPoet;
  projectTypeDisabled: boolean = true;
  buyerDisabled: boolean = true;

  public swalhtml: string = "I will close in <strong></strong> seconds.<br/><br/>I need 5 more seconds!";

  goodServicesDeliveredhtml:string = "Confirm if goods/services delivered at the time of raising the PR";
  invoiceReceivedhtml = "Confirm if invoice is already issued at the time of raising the PR";
  procrumentSourcinghtml = "Is RFP complete?";
  buyerhtml = "If sourcing was done, who in Procurement was involved?";
  projectValuehtml = "High Value Purchase (AED 100K and above) <br/>Lower Value Purchase (AED 99,999 and below)";
  projectTypeshtml = "Select from - Existing Contract, Emergency, Single Source, Tender, Quotes, Bids or None";
  paymentTermshtml = "Select from - 30 days net, 45 days net, MAF Std 60 days, Contract, Immediate, In Advance, Milestone, On Delivery, Others";
  aribaAwardedhtml = "If <b>Procurement Sourcing</b> is YES, please select YES here if Buyer has given confirmation of Ariba Awarded";
  justifySSEmergencyhtml = "Put reason if '<b>Project Type</b>' selected is Single Source or Emergeny, otherwise put '<b>Not Applicable</b>'";
  justifyDeviationTermshtml = "Put reason if '<b>Payment Terms</b>' is Immediate, On Delivery or In Advance";
  projectDetailshtml = "Further details not mentioned above can be put here. It can be used for monitoring expenses of the same projects.";

  dataAribaAwarded: any = [];
  dataProjectValue: any = [];
  dataPaymentTerms: any = [];
  dataProjectTypes: any = [];
  databuyer: any = [];
  public dataYear: Array<Select2OptionData>;
  
  
  constructor(
    private router: Router,
    private frmbuilder: FormBuilder,
    private toastr: ToastrService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private service: ApiService,
    private sanitizer: DomSanitizer,
    private excelService: ExcelService,
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
    config.backdrop = "static";
    config.keyboard = false;
    const today = new Date();
    this.minDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1, // Months are 0-based in JavaScript
      day: today.getDate(),
    };
    this.createForm();
    this.createFormUser();
    this.searchYear = this.fb.group({
      year: ["2024"]
    });
    this.searchYear.controls["year"].setValue("2024");
    this.goodServicesDeliveredhtml = sanitizer.sanitize(SecurityContext.HTML, this.goodServicesDeliveredhtml)|| '';
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
     $('.liBooking').addClass('liactive');
     $('.modal').css('overflow-y', 'auto');
      // jQuery is now available for use in the browser
     console.log('jQuery loaded in the browser');
    });
  }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    
      import('jquery').then((jQueryModule) => {
        const $ = jQueryModule.default; 
        $("a").removeClass("liactive");
        $(".liBooking").addClass("liactive");
        $('.modal').css('overflow-y', 'auto');
      }).catch((err) => {
        console.error('Error loading jQuery:', err);
      });
     
    }
    if (typeof window !== 'undefined') {
      // Browser-specific code
      (window as any).jQuery = $;
      (window as any).$ = $;
    }
   
    this.isLoader = true;
    // $("a").removeClass("liactive");
    // $(".liBooking").addClass("liactive");
    // $('.modal').css('overflow-y', 'auto');
    this.getUserName();
  }

  getUserName() {
   this.service.getUserName().subscribe(res => {
      if (res != null && res != "") {
        let user = res as any;
       // this.loginUserName = 'charles.awad@maf.ae'; user.d.Email;
        this.loginUserName = user.d.Email; //'veerender.kumar-e@maf.ae';//
     }
      this.getDataUsers();
      this.getDataCurrency();
      this.GetVendorData();
      this.GetAribaAward();
      this.GetProjectValue();
      this.GetPaymentTerms();
      this.GetPoetData(this.searchYear.controls["year"].value);
       this.service.getEmployee(this.loginUserName).subscribe(res => {
        if (res != null && res != '') {
          let users = res as any;
          const c: any = users.d.results[0] as [];
          let user_role =  c.Role; //'Super Admin';//
          if (user_role != null && user_role.length > 0) {
            if (user_role == 'Super Admin') {
              this.isAdmin = false;
              this.isSuperAdmin = true;
              this.isUser = false;
            } else if (user_role == 'Admin') {
              this.isAdmin = true;
              this.isSuperAdmin = false;
              this.isUser = false;
            } else if (user_role == 'User') {
              this.isAdmin = false;
              this.isSuperAdmin = false;
              this.isUser = true;
            }
          }
        }
        this.GetData(true, this.searchYear.controls["year"].value);
        setInterval(() => { this.refreshBBData(); }, 360000);
      });
    });
  }

  refreshBBData() {
    this.GetData(false, this.searchYear.controls["year"].value);
  }

  GetPoetData(year: string) {
    //alert("get GetPoetData satart");
    this.service.getPoet(year, this.loginUserName.toLowerCase()).subscribe(res => {
      this.objAccPoets = res as PoetClass[];
      let other:any = [];
      let projects:any = [];
      this.objAccPoets.map(item => { return { id: item.poetNumber, text: item.poetNumber }; }).forEach(item => other.push(item));
      this.dataPOETNumber = other;
      this.objAccPoets.map(item => { return { id: item.projectName, text: item.projectName }; }).forEach(item => projects.push(item));
      this.dataProjects = projects;
    });
    //alert("get GetPoetData end");
  }

  clearFileDaily() {
    var file = $("#dailyfile");
    file.replaceWith(file.val("").clone(true));
  }

  onFileChangeDaily(event:any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        var val = reader.result as string;
        let budgetAttachment = new BudgetAttachment();
        budgetAttachment.name = file.name;
        if (file.type == "")
          budgetAttachment.type = "application/octet-stream";
        else
          budgetAttachment.type = file.type;
        budgetAttachment.base64 = val.split(",")[1];
        this.fileUpload(budgetAttachment);
        event.srcElement.value = null;
      };
    }
  }

  fileUpload(BudgetAttachment: BudgetAttachment) {
    this.service.fileUpload(BudgetAttachment).subscribe(res => {
      let result: any;
      result = res;
      if (result.flag == true) {
        this.objBudgetAttachments.push(result);
      }
    });
  }

  GetVendorData() {
    
    this.service.getVendors().subscribe(res => {
      let objPoets = res as Vendor[];
      let other:any = [];
      objPoets.map(item => { return { id: item.supplierId, text: item.vendorName }; }).forEach(item => other.push(item));
      this.dataVendor = other;
    });
    
  }

  GetAribaAward() {
    
    this.service.getAriba().subscribe(res => {
      let objAribaAwarded = res as any[];
      let other:any = [];
      objAribaAwarded.map(item => { return { id: item.flexValue, text: item.description }; }).forEach(item => other.push(item));
      this.dataAribaAwarded = other;
    });
    
  }

  GetProjectValue() {
    
    this.service.getProjectValue().subscribe(res => {
      let objProjectValue = res as any[];
      let other:any = [];
      objProjectValue.map(item => { return { id: item.flexValue, text: item.description }; }).forEach(item => other.push(item));
      this.dataProjectValue = other;
    });
    
  }

  GetPaymentTerms() {
    
    this.dataPaymentTerms = [];
    this.service.getPaymentTerms().subscribe(res => {
      let objPaymentTerms = res as any[];
      let other:any = [];
      objPaymentTerms.map(item => { return { id: item.flexValue, text: item.description }; }).forEach(item => other.push(item));
      this.dataPaymentTerms = other;
    });
    
  }

  changedProjectValue(e: any): void {
    this.projectTypeDisabled = true;
    this.dataProjectTypes = [];
    this.service.getProjectTypes(e.id).subscribe(res => {
      let objProjectTypes = res as any[];
      let other:any = [];
      objProjectTypes.map(item => { return { id: item.flexValue, text: item.description }; }).forEach(item => other.push(item));
      this.dataProjectTypes = other;
      this.projectTypeDisabled = false;
    });
  }

  changeBuyer(e: any | null): void {
    const target = e.target as HTMLSelectElement;
    const value = target?.value;
    this.buyerDisabled = true;
    this.service.getBuyer(value).subscribe(res => {
      let objBuyer = res as any[];
      let other:any = [];
      objBuyer.map(item => { return { id: item.flexValue, text: item.description }; }).forEach(item => other.push(item));
      this.databuyer = other;
      if (value == "No")
        this.bbfForm.controls["buyer"].setValue("None");
      this.buyerDisabled = false;
    });
  }

  GetVendorDataSites(VendorSite: VendorSite) {
    this.service.getVendorsSites(VendorSite).subscribe(res => {
      let objPoets = res as VendorSiteDetails[];
      let other:any = [];
      objPoets.map(item => { return { id: item.siteId, text: item.siteName }; }).forEach(item => other.push(item));
      this.dataVendorSite = other;
    });
    this.bbfForm.controls["vendorSiteId"].setValue("Select");
  }

  saveData(angForm: any, isSubmitted: boolean) {
    debugger;
    this.isLoader = true;
    if (this.bbLinesForm.valid) {
      this.addBudgetLines(this.bbLinesForm);
    }
    this.addBudget(angForm);
    console.log(this.objBudgetBooking);
    this.saveDatatoBudgetBooking(this.objBudgetBooking, isSubmitted);
  }

  ReSaveData(angForm: any, isSubmitted: boolean) {
    this.isLoader = true;
    if (this.bbLinesForm.valid)
      this.addBudgetLines(this.bbLinesForm);

    let totalAmount: number = 0;
    this.objPoetUserData.forEach(item => {
      totalAmount += Number(item.lineAmount);
    });
    this.addBudget(angForm);
    if (this.BBFtotalAmount < totalAmount) {
      let deleteBudgetBooking = new DeleteBudgetBooking();
      deleteBudgetBooking.bbHeaderID = this.bookingMasterID;
      deleteBudgetBooking.comments = '';
      this.service.UpdateDraftBB(deleteBudgetBooking).subscribe((res) => {
        this.saveDatatoBudgetBooking(this.objBudgetBooking, true);
      })
    }
    else
      this.saveDatatoBudgetBooking(this.objBudgetBooking, false);
  }

  public changedProject(e: any): void {
    this.bbLinesForm.controls["projectName"].setValue(e.text);
    this.FCdesc = e.text;

    let objLevel1 = [];
    objLevel1 = this.objAccPoets.filter(
      l => l.projectName == this.bbLinesForm.value.projectName
    );
    if (e.text == 'Travel CMO' || e.text == 'Travel Loyalty' || e.text == 'Travel Marketing' || e.text == 'Travel Communication' || e.text == 'Travel Brand') {
      this.travelPoet = true;
      this.bbLinesForm.controls["unitPrice"].setValue(1)
    }
    else {
      this.travelPoet = false;
      this.bbLinesForm.controls["unitPrice"].setValue(0)
    }
    if (objLevel1 != null && objLevel1.length > 0) {
      this.bbLinesForm.controls["level1"].setValue(objLevel1[0].level1);
      this.bbLinesForm.controls["level2"].setValue(objLevel1[0].level2);
      this.bbLinesForm.controls["level3"].setValue(objLevel1[0].level3);
      this.bbLinesForm.controls["level4"].setValue(objLevel1[0].level4);
      this.bbLinesForm.controls["poetNumber"].setValue(objLevel1[0].poetNumber);
      let poetNumber = new BudgetPoetNumber();
      poetNumber.poetNumber = objLevel1[0].poetNumber;
      poetNumber.year = this.searchYear.controls["year"].value;
      this.getBudgetAmount(poetNumber);
    }
  }

  public changedPoet(e: any): void {
    this.bbLinesForm.controls["poetNumber"].setValue(e.text);
    let poetNumber = new BudgetPoetNumber();
    poetNumber.poetNumber = e.text;
    poetNumber.year = this.searchYear.controls["year"].value;
    this.getBudgetAmount(poetNumber);

    this.FCdesc = e.text;
    let objLevel1 = [];
    objLevel1 = this.objAccPoets.filter(
      l => l.poetNumber == this.bbLinesForm.value.poetNumber
    );

    if (e.text == '80.01' || e.text == '80.02' || e.text == '80.03' || e.text == '80.04' || e.text == '80.05') {
      this.travelPoet = true;
      this.bbLinesForm.controls["unitPrice"].setValue(1)
    }
    else {
      this.travelPoet = false;
      this.bbLinesForm.controls["unitPrice"].setValue(0)
    }

    if (objLevel1 != null && objLevel1.length > 0) {
      this.bbLinesForm.controls["level1"].setValue(objLevel1[0].level1);
      this.bbLinesForm.controls["level2"].setValue(objLevel1[0].level2);
      this.bbLinesForm.controls["level3"].setValue(objLevel1[0].level3);
      this.bbLinesForm.controls["level4"].setValue(objLevel1[0].level4);
      this.bbLinesForm.controls["projectName"].setValue(
        objLevel1[0].projectName
      );
    }
  }

  getBudgetAmount(BudgetPoetNumber: BudgetPoetNumber) {
    this.bbLinesForm.controls["availableActual"].setValue(0);
    this.bbLinesForm.controls["allocatedBudget"].setValue(0);
    this.bbLinesForm.controls["availableBudget"].setValue(0);
    this.bbLinesForm.controls["HoldingPercentage"].setValue(0);
    this.bbLinesForm.controls["PropertiesPercentage"].setValue(0);
    this.bbLinesForm.controls["RetailPercentage"].setValue(0);
    this.bbLinesForm.controls["VenturesPercentage"].setValue(0);
    this.bbLinesForm.controls["OtherPercentage"].setValue(0);
    this.service.getBudgetAmount(BudgetPoetNumber).subscribe(res => {
      let objPoets = res as BudgetAmount[];
      this.bbLinesForm.controls["availableActual"].setValue(objPoets[0].availableActual);
      this.bbLinesForm.controls["allocatedBudget"].setValue(objPoets[0].fullBudget);
      this.bbLinesForm.controls["availableBudget"].setValue(objPoets[0].yearlyBudget);
      this.bbLinesForm.controls["HoldingPercentage"].setValue(objPoets[0].holdingPercentage);
      this.bbLinesForm.controls["PropertiesPercentage"].setValue(objPoets[0].propertiesPercentage);
      this.bbLinesForm.controls["RetailPercentage"].setValue(objPoets[0].retailPercentage);
      this.bbLinesForm.controls["VenturesPercentage"].setValue(objPoets[0].venturesPercentage);
      this.bbLinesForm.controls["OtherPercentage"].setValue(objPoets[0].othersPercentage);
    });
  }

  getBudgetPercentageAmount(BudgetPoetNumber: BudgetPoetNumber) {
    this.bbLinesForm.controls["HoldingPercentage"].setValue(0);
    this.bbLinesForm.controls["PropertiesPercentage"].setValue(0);
    this.bbLinesForm.controls["RetailPercentage"].setValue(0);
    this.bbLinesForm.controls["VenturesPercentage"].setValue(0);
    this.bbLinesForm.controls["OtherPercentage"].setValue(0);
    this.service.getBudgetAmount(BudgetPoetNumber).subscribe(res => {
      let objPoets = res as BudgetAmount[];
      this.bbLinesForm.controls["HoldingPercentage"].setValue(objPoets[0].holdingPercentage);
      this.bbLinesForm.controls["PropertiesPercentage"].setValue(objPoets[0].propertiesPercentage);
      this.bbLinesForm.controls["RetailPercentage"].setValue(objPoets[0].retailPercentage);
      this.bbLinesForm.controls["VenturesPercentage"].setValue(objPoets[0].venturesPercentage);
      this.bbLinesForm.controls["OtherPercentage"].setValue(objPoets[0].othersPercentage);
    });
  }

  public changedvendor(e: any): void {
    this.selected = e.id;
    let vendorSite = new VendorSite();
    vendorSite.vendorID = e.id;
    vendorSite.currencyCode = this.bbfForm.value.currency;
    this.GetVendorDataSites(vendorSite);
  }

  pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  public changed(e: any): void {
    this.selected = e.text;
    this.selectedCurreny = e.text;
    if (e.text !== "AED") {
      this.objCurrencyRate = new CurrencyRate();
      if (this.bbfForm.value.exchangeRateDate != null) {
        this.objCurrencyRate.date =
          this.bbfForm.value.exchangeRateDate.year +
          "-" +
          this.pad(Number(this.bbfForm.value.exchangeRateDate.month), 2) +
          "-" +
          this.pad(Number(this.bbfForm.value.exchangeRateDate.day), 2)
      }
      this.objCurrencyRate.fromCurrency = e.text;
      this.service.getCurrencyRate(this.objCurrencyRate).subscribe(res => {
        let result = res as any;
        if (result != null) {
          this.bbfForm.controls["exchangeRate"].setValue(
            result.exchRate
          );
        } else {
          this.bbfForm.controls["exchangeRate"].setValue("");
        }
      });
    } else {
      let datepipe = new DatePipe("en-US");
      let date = datepipe.transform(new Date(), "yyyy-MM-dd");
      let yy,mm,dd =0;
      if(date){
        yy = Number(date.split("-")[0]);
        mm = Number(date.split("-")[1]);
        dd = Number(date.split("-")[2]);
      }
      
      this.bbfForm.controls["exchangeRateDate"].setValue({
        year: yy,
        month: mm,
        day: dd
      });
      this.bbfForm.controls["exchangeRate"].setValue("1");
    }
  }

  public ChangeDate(e: any): void {
    this.selectedCurreny = this.bbfForm.value.currency;
    if (this.bbfForm.value.currency !== "AED") {
      this.objCurrencyRate = new CurrencyRate();
      if (this.bbfForm.value.exchangeRateDate != null) {
        this.objCurrencyRate.date =
          this.bbfForm.value.exchangeRateDate.year +
          "-" +
          this.pad(Number(this.bbfForm.value.exchangeRateDate.month), 2) +
          "-" +
          this.pad(Number(this.bbfForm.value.exchangeRateDate.day), 2);
      }
      this.objCurrencyRate.fromCurrency = this.bbfForm.value.currency;
      this.service.getCurrencyRate(this.objCurrencyRate).subscribe(res => {
        let result = res as any;
        if (result != null) {
          this.bbfForm.controls["exchangeRate"].setValue(
            result.exchRate
          );
        } else {
          this.bbfForm.controls["exchangeRate"].setValue("");
        }
      });
    } else {
      let datepipe = new DatePipe("en-US");
      let date = datepipe.transform(new Date(), "yyyy-MM-dd");
      let yy,mm,dd =0;
      if(date){
         yy = Number(date.split("-")[0]);
         mm = Number(date.split("-")[1]);
         dd = Number(date.split("-")[2]);
      }
      
      this.bbfForm.controls["exchangeRateDate"].setValue({
        year: yy,
        month: mm,
        day: dd
      });
      this.bbfForm.controls["exchangeRate"].setValue("1");
    }
  }

  getTeams() {
    this.service.getTeams().subscribe(res => {
      this.objTeams = res;
      let other: { id: string, text: string }[] = [];
      this.objTeams.map((item:any) => { return { id: item.DESCRIPTION, text: item.DESCRIPTION }; }).forEach((item:any) => other.push(item));
      this.TeamData = other;
    });
  }

  getPoetUserData() {
    this.objBudgetBookingLines = new BudgetBookingLines();
    this.objBudgetBookingLines.bbheaderId = this.bookingMasterID;
    this.service.getBudgetLines(this.objBudgetBookingLines).subscribe(res => {
      this.objPoetUserData = res as BudgetBookingLines[];
      let totalAmount: number = 0;
      this.objPoetUserData.forEach(item => {
        totalAmount += Number(item.lineAmount);
      });
      this.bbfForm.controls["totalAmount"].setValue(totalAmount);
    });
  }

  getAllAttachements() {
    let attachmentId : any = { "bbHeaderId" : this.bookingMasterID };
    this.service.getAllAttachements(attachmentId).subscribe(res => {
      this.objBudgetAttachments = res;
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

  createFormUser() {
    this.bbLinesForm = this.frmbuilder.group({
      level1: [''],
      level2: [''],
      level3: [''],
      level4: [''],
      allocatedBudget: [''],
      availableActual: [''],
      chargeAccount: [''],
      dummyPoetCheck: [false],
      availableBudget: [''],
      bbheaderId:[''],
      creadtedBy: [''],
      lineAmount: [''],
      UserEndDate: [''],
      nextYearBBAmount: [''],
      poetNumber: ["", Validators.required],
      projectName: ["", Validators.required],
      quantity: ["1", Validators.required],
      unitPrice: ["0", Validators.required],
      uom: ["Each", Validators.required],
      updateDate: [''],
      updatedBy: [''],
      dailyfile: [""],
      HoldingPercentage: [0],
      VenturesPercentage: [0],
      PropertiesPercentage: [0],
      RetailPercentage: [0],
      OtherPercentage: [0],
      hotel: [0],
      airTicket: [0],
      mealsEntertainment: [0],
      generalExpenses: [0],
      lineDescription: ['']
    });
    if(this.bbLinesForm){
    this.bbLinesForm.controls["chargeAccount"].setValue("NA");
    this.bbLinesForm.controls["dummyPoetCheck"].setValue(false);
     }
     this.bbLinesForm.invalid == false;
    this.enableUserAdd = "APPLY";
    this.enableUserEdit = false;
    this.poetUserID = 0;
  }

  vaidateUserNumber(bbLinesForm: NgForm) {
    let objLevel1 = [];
    return true;
    /*if (this.objPoetUserData != null) {
      objLevel1 = this.objPoetUserData.filter(
        l => l.poetNumber == bbLinesForm.value.poetNumber
      );
      if (objLevel1 != null && objLevel1.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }*/
  }

  addBudgetLines(bbLinesForm:any) {
    if (this.bbLinesForm.value.chargeAccount == "NA" && bbLinesForm.value.dummyPoetCheck) {
      this.toastr.error("Failed", "Please Select an Charge Account", {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: "decreasing",
        easeTime: 300
      });
    }
    else {
      if (this.vaidateUserNumber(bbLinesForm)) {
        if (this.bookingMasterID == 0 && (this.bbLinesForm.value.poetNumber == '80.01' || this.bbLinesForm.value.poetNumber == '80.02' || this.bbLinesForm.value.poetNumber == '80.03'
          || this.bbLinesForm.value.poetNumber == '80.04' || this.bbLinesForm.value.poetNumber == '80.05')) {
          this.tavelPoetData = new travelPoet();
          this.tavelPoetData.hotel = this.bbLinesForm.value.hotel;
          this.tavelPoetData.airTicket = this.bbLinesForm.value.airTicket;
          this.tavelPoetData.expenses = this.bbLinesForm.value.generalExpenses;
          this.tavelPoetData.mealsEntertainment = this.bbLinesForm.value.mealsEntertainment;
          //Hotel
          if (this.tavelPoetData.hotel > 0) {
            this.objBudgetBookingLines = new BudgetBookingLines();
            this.objBudgetBookingLines.level1 = this.bbLinesForm.value.level1;
            this.objBudgetBookingLines.level2 = this.bbLinesForm.value.level2;
            this.objBudgetBookingLines.level3 = this.bbLinesForm.value.level3;
            this.objBudgetBookingLines.level4 = this.bbLinesForm.value.level4;
            this.objBudgetBookingLines.projectName = this.bbLinesForm.value.projectName;
            this.objBudgetBookingLines.poetNumber = this.bbLinesForm.value.poetNumber;
            this.objBudgetBookingLines.allocatedBudget = this.bbLinesForm.value.allocatedBudget;
            this.objBudgetBookingLines.availableBudget = this.bbLinesForm.value.availableBudget;
            this.objBudgetBookingLines.availableActual = this.bbLinesForm.value.availableActual;
            this.objBudgetBookingLines.uom = this.bbLinesForm.value.uom;
            this.objBudgetBookingLines.unitPrice = this.tavelPoetData.hotel;
            this.objBudgetBookingLines.quantity = 1;
            this.objBudgetBookingLines.lineAmount = this.tavelPoetData.hotel;
            this.objBudgetBookingLines.nextYearBBAmount = 0;
            this.objBudgetBookingLines.chargeAccount = "2001.114.64100002.0000.0000.0000";
            this.objBudgetBookingLines.dummyPoet = "Y";
            if (this.bookingMasterID > 0)
              this.objBudgetBookingLines.bbheaderId = this.bookingMasterID;
            else
              this.objBudgetBookingLines.bbheaderId = 0;

            if (this.poetUserID > 0)
              this.objBudgetBookingLines.id = this.poetUserID;
            else
              this.objBudgetBookingLines.id = 0;
            this.objBudgetBookingLines.lineDescription = this.bbLinesForm.value.lineDescription;
            this.objPoetUserData.push(this.objBudgetBookingLines);
          }
          //Air Ticket
          if (this.tavelPoetData.airTicket > 0) {
            this.objBudgetBookingLines = new BudgetBookingLines();
            this.objBudgetBookingLines.level1 = this.bbLinesForm.value.level1;
            this.objBudgetBookingLines.level2 = this.bbLinesForm.value.level2;
            this.objBudgetBookingLines.level3 = this.bbLinesForm.value.level3;
            this.objBudgetBookingLines.level4 = this.bbLinesForm.value.level4;
            this.objBudgetBookingLines.projectName = this.bbLinesForm.value.projectName;
            this.objBudgetBookingLines.poetNumber = this.bbLinesForm.value.poetNumber;
            this.objBudgetBookingLines.allocatedBudget = this.bbLinesForm.value.allocatedBudget;
            this.objBudgetBookingLines.availableBudget = this.bbLinesForm.value.availableBudget;
            this.objBudgetBookingLines.availableActual = this.bbLinesForm.value.availableActual;
            this.objBudgetBookingLines.uom = this.bbLinesForm.value.uom;
            this.objBudgetBookingLines.unitPrice = this.tavelPoetData.airTicket;
            this.objBudgetBookingLines.quantity = 1;
            this.objBudgetBookingLines.lineAmount = this.tavelPoetData.airTicket;
            this.objBudgetBookingLines.nextYearBBAmount = 0;
            this.objBudgetBookingLines.chargeAccount = "2001.114.64100003.0000.0000.0000";
            this.objBudgetBookingLines.dummyPoet = "Y";
            if (this.bookingMasterID > 0)
              this.objBudgetBookingLines.bbheaderId = this.bookingMasterID;
            else
              this.objBudgetBookingLines.bbheaderId = 0;

            if (this.poetUserID > 0)
              this.objBudgetBookingLines.id = this.poetUserID;
            else
              this.objBudgetBookingLines.id = 0;
            this.objBudgetBookingLines.lineDescription = this.bbLinesForm.value.lineDescription;
            this.objPoetUserData.push(this.objBudgetBookingLines);
          }
          //Meals & Entertainment
          if (this.tavelPoetData.expenses > 0) {
            this.objBudgetBookingLines = new BudgetBookingLines();
            this.objBudgetBookingLines.level1 = this.bbLinesForm.value.level1;
            this.objBudgetBookingLines.level2 = this.bbLinesForm.value.level2;
            this.objBudgetBookingLines.level3 = this.bbLinesForm.value.level3;
            this.objBudgetBookingLines.level4 = this.bbLinesForm.value.level4;
            this.objBudgetBookingLines.projectName = this.bbLinesForm.value.projectName;
            this.objBudgetBookingLines.poetNumber = this.bbLinesForm.value.poetNumber;
            this.objBudgetBookingLines.allocatedBudget = this.bbLinesForm.value.allocatedBudget;
            this.objBudgetBookingLines.availableBudget = this.bbLinesForm.value.availableBudget;
            this.objBudgetBookingLines.availableActual = this.bbLinesForm.value.availableActual;
            this.objBudgetBookingLines.uom = this.bbLinesForm.value.uom;
            this.objBudgetBookingLines.unitPrice = this.tavelPoetData.expenses;
            this.objBudgetBookingLines.quantity = 1;
            this.objBudgetBookingLines.lineAmount = this.tavelPoetData.expenses;
            this.objBudgetBookingLines.nextYearBBAmount = 0;
            this.objBudgetBookingLines.chargeAccount = "2001.114.64100007.0000.0000.0000";
            this.objBudgetBookingLines.dummyPoet = "Y";
            if (this.bookingMasterID > 0)
              this.objBudgetBookingLines.bbheaderId = this.bookingMasterID;
            else
              this.objBudgetBookingLines.bbheaderId = 0;

            if (this.poetUserID > 0)
              this.objBudgetBookingLines.id = this.poetUserID;
            else
              this.objBudgetBookingLines.id = 0;
            this.objBudgetBookingLines.lineDescription = this.bbLinesForm.value.lineDescription;
            this.objPoetUserData.push(this.objBudgetBookingLines);
          }
          //General expenses
          if (this.tavelPoetData.mealsEntertainment > 0) {
            this.objBudgetBookingLines = new BudgetBookingLines();
            this.objBudgetBookingLines.level1 = this.bbLinesForm.value.level1;
            this.objBudgetBookingLines.level2 = this.bbLinesForm.value.level2;
            this.objBudgetBookingLines.level3 = this.bbLinesForm.value.level3;
            this.objBudgetBookingLines.level4 = this.bbLinesForm.value.level4;
            this.objBudgetBookingLines.projectName = this.bbLinesForm.value.projectName;
            this.objBudgetBookingLines.poetNumber = this.bbLinesForm.value.poetNumber;
            this.objBudgetBookingLines.allocatedBudget = this.bbLinesForm.value.allocatedBudget;
            this.objBudgetBookingLines.availableBudget = this.bbLinesForm.value.availableBudget;
            this.objBudgetBookingLines.availableActual = this.bbLinesForm.value.availableActual;
            this.objBudgetBookingLines.uom = this.bbLinesForm.value.uom;
            this.objBudgetBookingLines.unitPrice = this.tavelPoetData.mealsEntertainment;
            this.objBudgetBookingLines.quantity = 1;
            this.objBudgetBookingLines.lineAmount = this.tavelPoetData.mealsEntertainment;
            this.objBudgetBookingLines.nextYearBBAmount = 0;
            this.objBudgetBookingLines.chargeAccount = "2001.114.64100001.0000.0000.0000";
            this.objBudgetBookingLines.dummyPoet = "Y";
            if (this.bookingMasterID > 0)
              this.objBudgetBookingLines.bbheaderId = this.bookingMasterID;
            else
              this.objBudgetBookingLines.bbheaderId = 0;

            if (this.poetUserID > 0)
              this.objBudgetBookingLines.id = this.poetUserID;
            else
              this.objBudgetBookingLines.id = 0;
            this.objBudgetBookingLines.lineDescription = this.bbLinesForm.value.lineDescription;
            this.objPoetUserData.push(this.objBudgetBookingLines);
          }
        }
        else {
          this.objBudgetBookingLines = new BudgetBookingLines();
          this.objBudgetBookingLines.level1 = this.bbLinesForm.value.level1;
          this.objBudgetBookingLines.level2 = this.bbLinesForm.value.level2;
          this.objBudgetBookingLines.level3 = this.bbLinesForm.value.level3;
          this.objBudgetBookingLines.level4 = this.bbLinesForm.value.level4;
          this.objBudgetBookingLines.projectName = this.bbLinesForm.value.projectName;
          this.objBudgetBookingLines.poetNumber = this.bbLinesForm.value.poetNumber;
          this.objBudgetBookingLines.allocatedBudget = this.bbLinesForm.value.allocatedBudget;
          this.objBudgetBookingLines.availableBudget = this.bbLinesForm.value.availableBudget;
          this.objBudgetBookingLines.availableActual = this.bbLinesForm.value.availableActual;
          this.objBudgetBookingLines.uom = this.bbLinesForm.value.uom;
          this.objBudgetBookingLines.unitPrice = this.bbLinesForm.value.unitPrice;
          this.objBudgetBookingLines.quantity = this.bbLinesForm.value.quantity;
          this.objBudgetBookingLines.lineAmount = this.bbLinesForm.value.lineAmount;
          this.objBudgetBookingLines.nextYearBBAmount = this.bbLinesForm.value.nextYearBBAmount;
          this.objBudgetBookingLines.chargeAccount = this.bbLinesForm.value.chargeAccount;

          if (bbLinesForm.value.dummyPoetCheck)
            this.objBudgetBookingLines.dummyPoet = "Y"
          else
            this.objBudgetBookingLines.dummyPoet = "N"

          if (this.bookingMasterID > 0)
            this.objBudgetBookingLines.bbheaderId = this.bookingMasterID;
          else
            this.objBudgetBookingLines.bbheaderId = 0;

          if (this.poetUserID > 0)
            this.objBudgetBookingLines.id = this.poetUserID;
          else
            this.objBudgetBookingLines.id = 0;

          this.objBudgetBookingLines.lineDescription = this.bbLinesForm.value.lineDescription;
          this.objPoetUserData.push(this.objBudgetBookingLines);
        }
        this.bbLinesForm.reset();
        this.bbLinesForm.controls["quantity"].setValue("1");
        this.bbLinesForm.controls["uom"].setValue("Each");
        this.enableUserAdd = "APPLY";
        this.totalBBFAmount = 0;
        this.objPoetUserData.forEach(item => {
          this.totalBBFAmount = this.totalBBFAmount + item.lineAmount;
        });
      } else {
        this.toastr.error("Failed", "BudgetBookingLines already exists", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          easeTime: 300
        });
      }

    }
  }

  isDisabled() {
    let ret = true;
    if (
      this.bbfForm.valid &&
      this.additionalInfoForm.valid &&
      this.bbfForm.value.vendorId > 0 &&
      this.objBudgetAttachments.length > 0 &&
      (this.bbLinesForm.valid || (this.objPoetUserData != null && this.objPoetUserData.length > 0)) &&
      this.bbfForm.value.JustifyEmergency != "" &&
      this.bbfForm.value.justificationPaymentTerms != "" &&
      this.bbfForm.value.buyer != "" &&
      this.bbfForm.value.projectValue != "" &&
      this.bbfForm.value.projectTypes != "" &&
      this.bbfForm.value.paymentTerms != "" &&
      this.bbfForm.value.aribaAwarded != "" &&
      this.bbfForm.value.lineType != "" &&
      this.bbfForm.value.goodsServicesDelivered != "" &&
      this.bbfForm.value.invoiceReceived != "" &&
      this.bbfForm.value.procurementSourcing != "" &&
      this.bbfForm.value.JustifyEmergency != " " &&
      this.bbfForm.value.justificationPaymentTerms != " " &&
      this.bbfForm.value.buyer != " " &&
      this.bbfForm.value.projectValue != " " &&
      this.bbfForm.value.projectTypes != " " &&
      this.bbfForm.value.paymentTerms != " " &&
      this.bbfForm.value.aribaAwarded != " " &&
      this.bbfForm.value.goodsServicesDelivered != " " &&
      this.bbfForm.value.invoiceReceived != " " &&
      this.bbfForm.value.procurementSourcing != " " &&
      this.bbfForm.value.vendorSiteId  > '0' 
    ) {
      ret = false;
    }
    return ret;
  }
  toNumber(value: any): number {
    return Number(value);
}

  isLaterDisabled() {
    let ret = true;
    if (
      this.bbfForm.valid &&
      this.additionalInfoForm.valid &&
      this.bbfForm.value.vendorId > 0 &&
      (this.bbLinesForm.valid ||
        (this.objPoetUserData != null && this.objPoetUserData.length > 0))
    ) {
      ret = false;
    }
    return ret;
  }

  handleConfirm(comments: string, poet: any): void {
    if (comments != "") {
      this.Delete(poet, comments);
    }
    else {
      this.toastr.error("Please enter Comments", "Error Occured", {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: "decreasing",
        easeTime: 300
      });
    }
  }


  vaidatePoetUsers(bbfForm: NgForm) {
    let other:any = [];
    other.push(bbfForm.value.OwnerName);
    other.push(bbfForm.value.Reviewer1);
    other.push(bbfForm.value.Reviewer2);
    var uniqueValues = $.grep(other, function (v:any, k:any) {
      return $.inArray(v, other) === k;
    });
    if (uniqueValues.length !== other.length) {
      return false;
    } else {
      return true;
    }
  }

  updateAttachemnt(item: any, poetid: number) {
    let objupdateAttachement = new updateAttachement();
    objupdateAttachement.bbHeaderId = poetid;
    objupdateAttachement.id = item.id;
    this.service.updateAttachements(objupdateAttachement).subscribe(res => {     });
  }

  saveBudgetBookingLines(user: BudgetBookingLines, poetid: number, count: number) {
    user.bbheaderId = poetid;
    this.service.saveBudgetLines(user).subscribe(res => {
      let result: any;
      result = res;
      //if (count === this.objPoetUserData.length - 1) {
      //this.GetData(false, this.searchYear.controls["year"].value);
      //this.refreshBBData();
      //}
      return result;
    });
  }

  addBudget(bbfForm: any): BudgetBooking {
    console.log(bbfForm);
    this.objBudgetBooking = new BudgetBooking();
    this.objBudgetBooking.createdBy = this.loginUserName;
    this.objBudgetBooking.lastUpdatedBy = this.loginUserName;
    this.objBudgetBooking.currency = bbfForm.currency;
    this.objBudgetBooking.exchangeRateType = bbfForm.exchangeRateType;
    if (bbfForm.exchangeRateDate != null) {
      this.objBudgetBooking.exchangeRateDate =
        bbfForm.exchangeRateDate.year +
        "-" +
        this.pad(Number(this.bbfForm.value.exchangeRateDate.month), 2) +
        "-" +
        this.pad(Number(this.bbfForm.value.exchangeRateDate.day), 2);
    }
    this.objBudgetBooking.exchangeRate = bbfForm.exchangeRate;
    this.objBudgetBooking.requestedBy = bbfForm.requestedBy;
    this.objBudgetBooking.poRequired = bbfForm.poRequired;
    this.objBudgetBooking.description = bbfForm.justification;
    this.objBudgetBooking.justification = this.additionalInfoForm.value.lineJustification;
    this.objBudgetBooking.bbStatus = "Draft";
    if (this.bbfForm.value.needByDate == null) {
    } else {
      this.objBudgetBooking.needByDate =
        this.bbfForm.value.needByDate.year +
        "-" +
        this.pad(Number(this.bbfForm.value.needByDate.month), 2) +
        "-" +
        this.pad(Number(this.bbfForm.value.needByDate.day), 2);
    }
    this.objBudgetBooking.vendorId = this.bbfForm.value.vendorId;
    this.objBudgetBooking.vendorSiteId = this.bbfForm.value.vendorSiteId;
    this.objBudgetBooking.budgetStatus = this.bbfForm.value.budgetStatus;
    this.objBudgetBooking.projectType = this.bbfForm.value.projectType;
    this.objBudgetBooking.lineType = this.bbfForm.value.lineType;
    this.objBudgetBooking.procurementSourcing = this.bbfForm.value.procurementSourcing;
    this.objBudgetBooking.buyerValue = this.bbfForm.value.buyer;
    this.objBudgetBooking.projectValue = this.bbfForm.value.projectValue;
    this.objBudgetBooking.projectTypesValue = this.bbfForm.value.projectTypes;
    this.objBudgetBooking.justifySSEmergency = this.bbfForm.value.JustifyEmergency;
    this.objBudgetBooking.goodServicesDelivered = this.bbfForm.value.goodsServicesDelivered;
    this.objBudgetBooking.invoiceReceived = this.bbfForm.value.invoiceReceived;
    this.objBudgetBooking.paymentTermsValue = this.bbfForm.value.paymentTerms;
    this.objBudgetBooking.justifyDeviationPymtTerms = this.bbfForm.value.justificationPaymentTerms;
    this.objBudgetBooking.projectDetails = this.additionalInfoForm.value.lineJustification;
    this.objBudgetBooking.aribaAwardedValue = this.bbfForm.value.aribaAwarded;

    if (this.bbfForm.value.buyer != "" && this.bbfForm.value.buyer != " ") {
      const buyerDesc = this.databuyer.filter((item:any) => item.id == this.bbfForm.value.buyer);
      this.objBudgetBooking.buyerDesc = buyerDesc[0].text;
    }
    if (this.bbfForm.value.projectValue != "" && this.bbfForm.value.projectValue != " ") {
      const projectValueDesc = this.dataProjectValue.filter((item:any) => item.id == this.bbfForm.value.projectValue);
      this.objBudgetBooking.projectValueDesc = projectValueDesc[0].text;
    }

    if (this.bbfForm.value.projectTypes != "" && this.bbfForm.value.projectTypes != " ") {
      const projectTypesDesc = this.dataProjectTypes.filter((item:any) => item.id == this.bbfForm.value.projectTypes);
      this.objBudgetBooking.projectTypesDesc = projectTypesDesc[0].text;
    }

    if (this.bbfForm.value.paymentTerms != "" && this.bbfForm.value.paymentTerms != " ") {
      const paymentTermsDesc = this.dataPaymentTerms.filter((item:any) => item.id == this.bbfForm.value.paymentTerms);
      this.objBudgetBooking.paymentTermsDesc = paymentTermsDesc[0].text;
    }

    if (this.bbfForm.value.aribaAwarded != "" && this.bbfForm.value.aribaAwarded != " ") {
      const aribaAwardedDesc = this.dataAribaAwarded.filter((item:any) => item.id == this.bbfForm.value.aribaAwarded);
      this.objBudgetBooking.aribaAwardedDesc = aribaAwardedDesc[0].text;
    }

    if (this.bookingMasterID > 0) {
      this.objBudgetBooking.id = this.bookingMasterID;
    } else {
      this.objBudgetBooking.id = 0;
    }
    return this.objBudgetBooking;
  }

  saveDatatoBudgetBooking(BudgetBooking: BudgetBooking, isSubmitted: boolean) {
    this.service.saveBudget(BudgetBooking).subscribe(res => {
      let result: any;
      result = res;
      if (result.flag === true) {
        const poet = result.objBudgetBookingItem;
        const poetid = poet.id;
        this.LastpoetID = poetid;
        let count = 0;
        this.objPoetUserData.forEach(item => {
          this.saveBudgetBookingLines(item, poetid, count);
          count++;
        });
        this.objBudgetAttachments.forEach((item:any) => {
          this.updateAttachemnt(item, poetid);
        });
        this.bbfForm.reset();
        if (isSubmitted) {
          this.delay(2000).then(any => {
            const budgetPoetId = new BudgetPoetId();
            budgetPoetId.id = this.LastpoetID;
            this.service.sendApproval(budgetPoetId).subscribe(response => {
              result = response;
              if (result === true) {
                this.bbfForm.reset();
                this.modalService.dismissAll();
                this.refreshBBData();
              } else {
                this.toastr.error(result, "Error Occured", {
                  timeOut: 3000,
                  progressBar: true,
                  progressAnimation: "decreasing",
                  easeTime: 300
                });
                setTimeout(() => {
                  this.isLoader = false;
                }, 300);
              }
            })
          });
        }
        else {
          this.refreshBBData();
          this.delay(1000).then(any => {
            setTimeout(() => {
              this.isLoader = false;
            }, 300);
          });
        }
        this.modalService.dismissAll();
      } else {
        this.toastr.error(result, "Error Occured", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: "decreasing",
          easeTime: 300
        });
      }
    });
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() =>
      console.log("fired")
    );
  }

  InitiateApproval(poet:any) {
    this.isLoader = true;
    let budgetPoetId = new BudgetPoetId();
    if (poet.id > 0) {
      budgetPoetId.id = poet.id;
      console.log(poet);
      this.service.sendApproval(budgetPoetId).subscribe(res => {
        let result: any;
        result = res;
        if (result === true) {
          this.refreshBBData();
          this.modalService.dismissAll();
        } else {
          this.toastr.error(result, "Error Occured", {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: "decreasing",
            easeTime: 300
          });
        }
      });
    }
  }

  DeleteFile(poet:any) {
    const index = this.objBudgetAttachments.findIndex((user:any) => user === poet);
    if(poet.headerId != null) {
      let objupdateAttachement = new updateAttachement();
      objupdateAttachement.id = poet.id;
      this.service.removeAttachement(objupdateAttachement).subscribe(res => {
        
       });
    }
    this.objBudgetAttachments.splice(index, 1);
  }

  CreatePR(poet:any) {
    this.isLoader = true;
    if (poet.id > 0) {
      this.service.createPR(poet.id).subscribe(res => {
        let result: any;
        result = res;
        if (result.flag == true) {
          this.refreshBBData();
          this.modalService.dismissAll();
        } else {
          this.toastr.error(result.error, "Error Occured ", {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: "decreasing",
            easeTime: 300
          });
          this.refreshBBData();
        }
      });
    }
  }

  Delete(poet:any, comments:any) {
    this.isLoader = true;
    let objDeleteBudgetBooking = new DeleteBudgetBooking();
    if (poet.id > 0) {
      objDeleteBudgetBooking.bbHeaderID = poet.id;
      objDeleteBudgetBooking.comments = comments;
      this.service.deleteBB(objDeleteBudgetBooking).subscribe(res => {
        this.refreshBBData();
        this.modalService.dismissAll();
      });
    }
  }

  Resend(poet:any) {
    this.isLoader = true;
    if (poet.id > 0) {
      this.service.resendEmail(poet.id).subscribe(res => {
        setTimeout(() => { this.isLoader = false; }, 500);
      });
    }
  }

  GetData(isonint: boolean, year: string) {
    this.isLoader = true;
    this.service.getBudgetbyUser(this.loginUserName, this.isSuperAdmin, year).subscribe(res => {
      console.log(res);
      if (!isonint) {
        const table: any = $("#tblbooking").DataTable();
        table.destroy();
        this.chRef.detectChanges();
      }
      if (isonint) {
        this.objPoets = res as BudgetBooking[];
        this.chRef.detectChanges();
        $("#tblbooking thead tr").clone(true).appendTo("#tblbooking thead");
        let ele=$("#tblbooking thead tr:eq(0) th") as JQuery<HTMLElement>;
        ele.each(function (i:any) {
          if (i != 0) {
            var title = $(this).text();
            if (title == "Edit") {
              $(this).html("");
            } else {
              if (i == 1 || i == 4 || i == 7 || i == 8) {
                $(this).html(
                  '<input type="text" class=""  style="width: 50px;" placeholder="' +
                  title +
                  '" />'
                );
              } else if (i == 2 || i == 3 || i == 6) {
                $(this).html(
                  '<input type="text" class=""  style="width: 100px;" placeholder="' +
                  title +
                  '" />'
                );
              } else {
                $(this).html(
                  '<input type="text" class=""  style="width: 130px;" placeholder="' +
                  title +
                  '" />'
                );
              }
            }
          }
        });
      }
      else {
        const tblbooking: any = $("#tblbooking").DataTable();
        tblbooking.destroy();
        this.objPoets = [];
        this.chRef.detectChanges();
        this.objPoets = res as BudgetBooking[];
        this.chRef.detectChanges();
      }
  let ele1=$("#tblbooking thead tr:eq(0) th") as JQuery<HTMLElement>;
  ele1.each(function (i:any) {
        $("input", this).on("keyup change", (event:any)=> {

          if (table.column(i).search() !== event.target.value) {
            table
              .column(i)
              .search(event.target.value)
              .draw();
          }
        });
      });

      let table = $("#tblbooking").DataTable({
        dom: "Blfrtip",
        destroy: true,
        pageLength: 100,
        searching:true,
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
        ],
        columnDefs: [
          { width: "10px", targets: 0 },
          { width: "40px", targets: 1 },
          { width: "100px", targets: 2 },
          { width: "70px", targets: 3 },
          { width: "70px", targets: 4 },
          { width: "70px", targets: 5 }
        ]
        // ,
        // initComplete: function () {
        //   this.api()
        //     .columns()
        //     .every(()=> {
        //       var column = this;
        //       var select = $('<select><option value=""></option></select>')
        //         .appendTo($(column.footer()).empty())
        //         .on("change", (event:any)=>{
        //           var val = $.fn.dataTable.util.escapeRegex($(event.target).val());
        //           column.search(val ? "^" + val + "$" : "", true, false).draw();
        //         });
        //       column.data().unique().sort().each(function (d:any, j:any) {
        //         select.append('<option value="' + d + '">' + d + "</option>");
        //       });
        //     });
        // }
       
      });
      this.objPoets.forEach(a=>{
        a.attachment='1';
      })
      this.isLoader = false;
    });
  }

  fnAction() {
    //$(".buttons-excel").trigger("click");
    let datas:any = [];
    this.objPoets.forEach((item:any) => {
      let data = {
        'Booking Number': item.id,
        'Booking Status': item.bbStatus,
        'Booking Date': item.createdOn,
        'Currency': item.currency,
        'Requestor Name': item.knownName,
        'PO / Internal ?': item.poRequired,
        'PR numbe': item.prNo,
        'PO number': item.poNo,
        'Description':item.description,
        'Total Amount (AED) ': item.total,
        'Error Description': item.errorDesc
        
      };
      datas.push(data);
    });
    this.excelService.exportAsExcelFile(datas, 'Budget Booking');
  }

  changedYear(e: any): void {
    this.isLoader = true;
    const table: any = $("#tblbooking").DataTable();
    table.destroy();
    this.chRef.detectChanges();
    this.GetPoetData(e.text);
    this.GetData(false, e.text);
  }


  public handleRefusalData(dismissMethod: Event): void { }

  selected(event:any) {
    
  }

  getDataUsers() {
    
    this.service.getUsers().subscribe(res => {
      this.objUsers = res;
      let other:any = [];
      this.objUsers.map((item:any) => { return { id: item.emailAddress.toLowerCase(), text: item.fullName }; }).forEach((item:any) => other.push(item));
      this.dataUsers = other;
    });
    
  }

  getDataCurrency() {
   
    this.service.getCurrency().subscribe(res => {
      this.objCurrency = res;
      let other:any = [];
      this.objCurrency.map((item:any) => { return { id: item.flexValue, text: item.description }; }).forEach((item:any) => other.push(item));
      this.dataCurrency = other;
      //console.log(this.dataCurrency);
    });
  
  }

  createForm() {
    this.isUploadEnabled = false;
    this.projectTypeDisabled = true;
    this.buyerDisabled = true;
    this.modaltitle = "CREATE A BOOKING REQUEST";
    this.bookingMasterID = 0;
    this.bbfForm = this.fb.group({
      bbNumber: [''],
      bbDate: [''],
      bbStatus: ["Draft"],
      currency: ["AED", Validators.required],
      exchangeRate: ["1", Validators.required],
      exchangeRateType: ["Corporate"],
      exchangeRateDate: [''],
      requestedBy: ["", Validators.required],
      justification: ["", Validators.required],
      poRequired: ["PO", Validators.required],
      totalAmount: [''],
      vendorId: [''],
      vendorSiteId: [''],
      vendorName: [''],
      vendorSiteName: [''],
      budgetStatus: ["BUDGETED", Validators.required],
      lineType: ["Fixed Price Services", Validators.required],
      needByDate: [''],
      projectType: ["BUSINESS AS USUAL", Validators.required],
      JustifyEmergency: [""],
      justificationPaymentTerms: [""],
      buyer: [""],
      projectValue: [""],
      projectTypes: [""],
      paymentTerms: [""],
      aribaAwarded: [""],
      goodsServicesDelivered: [""],
      invoiceReceived: [""],
      procurementSourcing: [""]
    });

    this.additionalInfoForm = this.fb.group({
      lineJustification: ["", Validators.required]
    });

    if(this.bbfForm){
    
    let datepipe = new DatePipe("en-US");

    this.bbfForm.controls["bbDate"].setValue(
      datepipe.transform(new Date(), "yyyy-MM-dd")
    );

    let date = datepipe.transform(new Date(), "yyyy-MM-dd");
    let yy,mm,dd =0;
    if(date){
      yy = Number(date.split("-")[0]);
      mm = Number(date.split("-")[1]);
      dd = Number(date.split("-")[2]);
    }
    this.bbfForm.controls["exchangeRateDate"].setValue({
      year: yy,
      month: mm,
      day: dd
    });
    this.bbfForm.controls["needByDate"].setValue({
      year: yy,
      month: mm,
      day: dd
    });
    this.selectedCurreny = this.bbfForm.value.currency;
  }
    this.isBtnEnabled = true;
    this.isBtnLater = true;
    this.objBudgetAttachments = [];
    this.databuyer = [];
    this.dataProjectTypes = [];
  }

  onChangeCalAmount() {
    let UP = Number(this.bbLinesForm.value.unitPrice);
    let Q = Number(this.bbLinesForm.value.quantity);
    let r = Number(this.bbfForm.value.exchangeRate);
    let total = UP * Q * r;
    this.bbLinesForm.controls["lineAmount"].setValue(total);

    let AvailableActual = Number(this.bbLinesForm.value.availableActual);

    if (total > AvailableActual && !this.bbLinesForm.value.dummyPoetCheck) {
      this.bbLinesForm.controls["unitPrice"].setValue("0");
      this.bbLinesForm.controls["lineAmount"].setValue("0");
      this.toastr.error(
        "Total amount cannot be exceeds Available Budget",
        "Error Occured",
        {
          timeOut: 9000,
          progressBar: true,
          progressAnimation: "decreasing",
          easeTime: 300
        }
      );
    }
  }

  open(content:any, StopCreatingBBF:any) {
    if (this.searchYear.controls["year"].value == 2024) {
      this.createForm();
      this.createFormUser();
      let objPoetUser: BudgetBookingLines[] = [];
      this.objPoetUserData = objPoetUser;
      this.modalService.open(content, { size: "lg", centered: true , backdrop: false });
    }
    else {
      this.modalService.open(StopCreatingBBF, { size: "lg", centered: true , backdrop: false });
    }
  }

  showStatus(poet:any, content1:any) {
    let id = poet.id;
    this.objPoetStatusData = [];
    this.service.getApprovalList(id).subscribe(res => {
      this.objPoetStatusData = res;
      this.modalService.open(content1, { size: "lg", centered: true , backdrop: false });
    });
  }

  editPoet(poet:any, content:any, isUploadEnabled:any) {
    this.isLoader = true;
    this.bbLinesForm.controls["dummyPoetCheck"].setValue(false);
    this.createForm();
    this.createFormUser();
    if (isUploadEnabled)
      this.isUploadEnabled = true;
    else
      this.isUploadEnabled = false;

    this.modaltitle = "UPDATE BOOKING REQUEST ";
    this.bookingMasterID = poet.id;
    this.bbfForm.controls["bbStatus"].setValue(poet.bbStatus);
    this.bbfForm.controls["currency"].setValue(poet.currency);
    this.bbfForm.controls["exchangeRate"].setValue(poet.exchangeRate);
    this.bbfForm.controls["exchangeRateType"].setValue(poet.exchangeRateType);
    this.bbfForm.controls["requestedBy"].setValue(poet.requestedBy);
    this.bbfForm.controls["justification"].setValue(poet.description);
    this.bbfForm.controls["poRequired"].setValue(poet.poRequired);
    this.bbfForm.controls["bbNumber"].setValue(poet.id);
    if (poet.exchangeRateDate != "" && poet.exchangeRateDate != null) {
      let datepipe = new DatePipe("en-US");
      let date = datepipe.transform(new Date(poet.exchangeRateDate), "yyyy-MM-dd");
      let yy,mm,dd =0;
      if(date){
        yy = Number(date.split("-")[0]);
        mm = Number(date.split("-")[1]);
        dd = Number(date.split("-")[2]);
      }
      this.bbfForm.controls["exchangeRateDate"].setValue({ year: yy, month: mm, day: dd });
    }

    this.bbfForm.controls["vendorId"].setValue(poet.vendorId);

    if (poet.vendorId != null) {
      let vendorSite = new VendorSite();
      vendorSite.vendorID = poet.vendorId;
      vendorSite.currencyCode = this.bbfForm.value.currency;
      this.GetVendorDataSites(vendorSite);
      this.bbfForm.controls["vendorSiteId"].setValue(poet.vendorSiteId);
    }
    if (poet.needByDate != "" && poet.needByDate != null) {
      let datepipe = new DatePipe("en-US");
      let date = datepipe.transform(new Date(poet.needByDate), "yyyy-MM-dd");
      let yy,mm,dd =0;
      if(date){
        yy = Number(date.split("-")[0]);
        mm = Number(date.split("-")[1]);
        dd = Number(date.split("-")[2]);
      }
      this.bbfForm.controls["needByDate"].setValue({ year: yy, month: mm, day: dd });
    }

    this.bbfForm.controls["budgetStatus"].setValue(poet.budgetStatus);
    this.bbfForm.controls["projectType"].setValue(poet.projectType);
    this.bbfForm.controls["lineType"].setValue(poet.lineType);
    this.additionalInfoForm.controls["lineJustification"].setValue(poet.justification);
    this.bbfForm.controls["JustifyEmergency"].setValue(poet.justifySSEmergency);
    this.bbfForm.controls["justificationPaymentTerms"].setValue(poet.justifyDeviationPymtTerms);
    this.bbfForm.controls["projectValue"].setValue(poet.projectValue);
    this.bbfForm.controls["paymentTerms"].setValue(poet.paymentTermsValue);
    this.bbfForm.controls["aribaAwarded"].setValue(poet.aribaAwardedValue);
    this.bbfForm.controls["goodsServicesDelivered"].setValue(poet.goodServicesDelivered);
    this.bbfForm.controls["invoiceReceived"].setValue(poet.invoiceReceived);
    this.bbfForm.controls["procurementSourcing"].setValue(poet.procurementSourcing);
    this.databuyer = [];
    this.service.getBuyer(poet.procurementSourcing).subscribe(res => {
      let objBuyer = res as any[];
      let other:any = [];
      objBuyer.map(item => { return { id: item.flexValue, text: item.description }; }).forEach(item => other.push(item));
      this.databuyer = other;
      this.bbfForm.controls["buyer"].setValue(poet.buyerValue);
      this.buyerDisabled = false;
    });

    this.dataProjectTypes = [];
    this.service.getProjectTypes(poet.projectValue).subscribe(res => {
      let objProjectTypes = res as any[];
      let other:any = [];
      objProjectTypes.map(item => { return { id: item.flexValue, text: item.description }; }).forEach(item => other.push(item));
      this.dataProjectTypes = other;
      this.bbfForm.controls["projectTypes"].setValue(poet.projectTypesValue);
      this.projectTypeDisabled = false;
    });

    if (poet.bbStatus == "Approved") {
      this.isBtnSave = true;
      this.isBtnLater = false;
    } else
      this.isBtnSave = false;

    if (poet.bbStatus == "Draft" || poet.bbStatus == "Rejected") {
      this.isBtnLater = true;
      this.isBtnEnabled = true;
    } else {
      this.isBtnLater = false;
      this.isBtnEnabled = false;
    }
    this.BBFtotalAmount = poet.TOTAL;
    this.selectedCurreny = this.bbfForm.value.currency;

    this.getAllAttachements();
    this.getPoetUserData();
    this.isLoader = false;
    this.modalService.open(content, { size: "lg", centered: true , backdrop: false
    });
  }

  editBookingLines(poet:any) {
    this.createFormUser();
    this.enableUserAdd = "APPLY";
    this.enableUserEdit = true;
    this.poetUserID = poet.id;
    this.bbLinesForm.controls["projectName"].setValue(poet.projectName);
    this.bbLinesForm.controls["poetNumber"].setValue(poet.poetNumber);
    this.bbLinesForm.controls["allocatedBudget"].setValue(poet.allocatedBudget);
    this.bbLinesForm.controls["availableBudget"].setValue(poet.availableBudget);
    this.bbLinesForm.controls["availableActual"].setValue(poet.availableActual);
    if (poet.dummyPoet === "Y")
      this.dummyCheckBox = true;
    else
      this.dummyCheckBox = false;
    if (this.dummyCheckBox) {
      this.bbLinesForm.controls["dummyPoetCheck"].setValue(true);
      this.bbLinesForm.controls["chargeAccount"].setValue(poet.chargeAccount)
    }
    this.bbLinesForm.controls["uom"].setValue(poet.uom);
    this.bbLinesForm.controls["unitPrice"].setValue(poet.unitPrice);
    this.bbLinesForm.controls["quantity"].setValue(poet.quantity);
    this.bbLinesForm.controls["lineAmount"].setValue(poet.lineAmount);
    this.bbLinesForm.controls["nextYearBBAmount"].setValue(
      poet.nextYearBBAmount
    );
    const index = this.objPoetUserData.findIndex(
      user =>
        user.id === poet.id &&
        user.poetNumber == poet.poetNumber &&
        user.projectName == poet.projectName
    );
    this.objPoetUserData.splice(index, 1);
    let poetNumber = new BudgetPoetNumber();
    poetNumber.poetNumber = poet.poetNumber;
    poetNumber.year = this.searchYear.controls["year"].value;
    this.bbLinesForm.controls["lineDescription"].setValue(poet.lineDescription);
    this.getBudgetPercentageAmount(poetNumber);
  }
}
