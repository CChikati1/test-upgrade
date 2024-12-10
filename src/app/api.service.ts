import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PoetClass,GetPoetDTO } from "./views/dashboard/PoetClass";
import { User } from "./views/theme/Users";
import { cmbUser } from "./views/theme/Users";
import { MonthClass } from "./views/dashboard/MonthClass";
import { Dashboard, BudgetUserYear, UpdatePOAmount, AddPOAmount, UpdateChange } from "./views/dashboard/masterPoetClass";
import { BudgetBooking } from "./views/dashboard/budgetBookingClass";
import { BudgetBookingLines } from "./views/dashboard/budgetBookingClass";
import { environment } from "../environments/environment";
import { of } from "rxjs";



@Injectable({
  providedIn: "root"
})

export class ApiService {
  
  Root_URL = environment.Root_URL;
  sp_URL = environment.sp_URL;
  constructor(
    private http: HttpClient
  ) { }

  public getMasterData() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getMasterData" );
  }

  public getFinanceCategories() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getFinanceCategories");
  }

  public getUsers() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getUsers");
  }
  getUserDetails() {
    const mockResponse = `<?xml version="1.0" encoding="utf-8"?>
    <entry xml:base="https://mafptawasul.maf.ae/holding/_api/" xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:georss="http://www.georss.org/georss" xmlns:gml="http://www.opengis.net/gml">
        <id>https://mafptawasul.maf.ae/holding/_api/Web/GetUserById(710)</id>
        <category term="SP.User" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme" />
        <link rel="edit" href="Web/GetUserById(710)" />
        <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Alerts" type="application/atom+xml;type=feed" title="Alerts" href="Web/GetUserById(710)/Alerts" />
        <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Groups" type="application/atom+xml;type=feed" title="Groups" href="Web/GetUserById(710)/Groups" />
        <title />
        <updated>2024-12-03T03:30:20Z</updated>
        <author><name /></author>
        <content type="application/xml">
            <m:properties>
                <d:Id m:type="Edm.Int32">710</d:Id>
                <d:IsHiddenInUI m:type="Edm.Boolean">false</d:IsHiddenInUI>
                <d:LoginName>i:0#.w|domain\vkumar2</d:LoginName>
                <d:Title>Veerender Kumar</d:Title>
                <d:PrincipalType m:type="Edm.Int32">1</d:PrincipalType>
                <d:Email>Veerender.Kumar-e@maf.ae</d:Email>
                <d:IsEmailAuthenticationGuestUser m:type="Edm.Boolean">false</d:IsEmailAuthenticationGuestUser>
                <d:IsShareByEmailGuestUser m:type="Edm.Boolean">false</d:IsShareByEmailGuestUser>
                <d:IsSiteAdmin m:type="Edm.Boolean">false</d:IsSiteAdmin>
                <d:UserId m:type="SP.UserIdInfo">
                    <d:NameId>s-1-5-21-1407541682-534602969-1849977318-56055</d:NameId>
                    <d:NameIdIssuer>urn:office:idp:activedirectory</d:NameIdIssuer>
                </d:UserId>
            </m:properties>
        </content>
    </entry>`;

    // Return the hardcoded response as an observable
    return of(mockResponse); // of() is an RxJS function that wraps the response in an observable
  }
  getUserName() {
    return this.http.get(this.sp_URL + "_api/Web/CurrentUser", { headers: { Accept: "application/json;odata=verbose" } });
  }

  getEmployee(empEmail:any) {
    return this.http.get("https://mafptawasul.maf.ae/Holding/_api/web/lists/getByTitle('Employee')/items?$filter=Title eq '" + empEmail + "'", { headers: { Accept: "application/json;odata=verbose" } });
  }

  savePoet(PoetClass: PoetClass) {
    if (PoetClass.poetId > 0)
      return this.http.post<PoetClass>("https://mafhbudgettrackerapi.maf.ae/api/POET/v1/update", PoetClass);
    else
      return this.http.post<PoetClass>("https://mafhbudgettrackerapi.maf.ae/api/POET/v1/save", PoetClass);
  }

  getPoet(year: String, email: String) {
    let objGetPoetDTO: GetPoetDTO;
    objGetPoetDTO = new GetPoetDTO()
    objGetPoetDTO.year = year;
    objGetPoetDTO.email = email;
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/POET/v1/get", objGetPoetDTO,{headers});
  }

  savecmbUsers(cmbUser: cmbUser) {
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    if (cmbUser.userID > 0)
      return this.http.post<PoetClass>("https://mafhbudgettrackerapi.maf.ae/api/cmbUsers/v1/updateCMBUsers", cmbUser,{headers});
    else
      return this.http.post<PoetClass>("https://mafhbudgettrackerapi.maf.ae/api/cmbUsers/v1/insertCMBUsers", cmbUser,{headers});
  }

  getcmbUsers() {
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/cmbUsers/v1/getCMBUsers",{headers});
  }

  getBudget(year: String) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getAllBB", year,{headers});
  }

  getPendingApproval() {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api//budgetBooking/v1/PendingApproval", "",{headers});
  }

  createPR(id:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/createPR", id,{headers});
  }

  getBBPendingApproval(id:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/BBPendingApproval", id,{headers});
  }

  getBudgetbyUser(user:any, isAdmin: boolean, year: string) {
    if (isAdmin) {
       const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getAllBB", year,{headers});
    } else {
      let objBudgetUserYear: BudgetUserYear = new BudgetUserYear();
      objBudgetUserYear.year = year
      objBudgetUserYear.userName = user
       const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getAllBBbyUser", objBudgetUserYear,{headers});
    }
  }

  getBBbyId(bbheaderID:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getBBbyId", bbheaderID,{headers});
  }

  getCMBUser(emailAddress:any){
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getCMBUser", emailAddress,{headers});
  }

  getApprovalDetails(id:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getApprovalDetails", id,{headers});
  }


  getCancellationDetails(id:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getCancellationDetails", id,{headers});
  }


  getBudgetLines(BudgetBooking:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getBBlines", BudgetBooking,{headers});
  }

  public saveBudget(BudgetBooking: BudgetBooking) {
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    if (BudgetBooking.id > 0)
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/UpdateDataBB", BudgetBooking,{headers});
    else
       
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/SaveDataBB", BudgetBooking,{headers});
  }

  public sendApproval(budget:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/sendApproval", budget,{headers});
  }

  public getApprovalList(id:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getApprovalList", id,{headers});
  }

  public saveBudgetLines(BudgetBookingLines: BudgetBookingLines) {
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    if (BudgetBookingLines.id > 0)
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/UpdateDataBBLines", BudgetBookingLines,{headers});
    else
    
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/SaveDataBBLines", BudgetBookingLines,{headers});
  }

  public getTeams() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getTeamName");
  }

  public getVendors() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getVendor");
  }

  public getAriba() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getAriba");
  }

  public getPaymentTerms() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getPaymentTerms");
  }

  public getProjectValue() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getProjectValue");
  }

  public getProjectTypes(projectValue: string) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getProjectTypes", projectValue,{headers});
  }

  public getBuyer(procrumentValue: string) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getBuyer", procrumentValue,{headers});
  }

  public getVendorsSites(VendorSite:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getVendorSite", VendorSite,{headers});
  }

  public getBudgetAmount(BudgetPoetNumber:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getBudgetAmount", BudgetPoetNumber);
  }

  public getCurrency() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getCurrencyCode");
  }

  public getCurrencyRate(CurrencyRate:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getRate", CurrencyRate);
  }

  public saveUserData(user: User) {
    //if (user.id > 0)
       const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/POET/v1/UpdatePoetUserAssignment", user);
    //else
       
   // return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/POET/v1/SavePoetUserAssignment", user);
  }

  public deleteUserData(user: User) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/POET/v1/deletePoetUserAssignment", user);
  }

  public fileUpload(BudgetAttachment:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/UploadDocument", BudgetAttachment);
  }

  public getPoetUserData(user:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/POET/v1/getPoetUserAssignment", user);
  }

  public getUserBudgetData(user:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/showUserBudgetData", user);
  }

  saveMonthwisePoet(monthClass: MonthClass) {
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    if (monthClass.id > 0)
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetEntry/v1/update", monthClass);
    else
     
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetEntry/v1/save", monthClass);
  }

  getMonthwisePoet(year: String, email: String) {
    let objGetPoetDTO: GetPoetDTO;
    objGetPoetDTO = new GetPoetDTO()
    objGetPoetDTO.year = year;
    objGetPoetDTO.email = email;
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetEntry/v1/get", objGetPoetDTO);
  }

  getBudgetTrackingData(year: String, email: String) {
    let objGetPoetDTO: GetPoetDTO;
    objGetPoetDTO = new GetPoetDTO()
    objGetPoetDTO.year = year;
    objGetPoetDTO.email = email;
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/get", objGetPoetDTO);
  }

  getBudgetTrackingPoetData(monthClass: MonthClass) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getPoetDetails", monthClass);
  }

  getBudgetTrackingMonthwiseData(monthClass: MonthClass) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getMonthlySummmary", monthClass);
  }

  getBudgetTrackingMonthwiseHistory(monthClass: MonthClass) {
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    if (monthClass.serviceType === "Allocated Budget")
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getAllocatedAmtMonDet", monthClass);
    else if (monthClass.serviceType === "Booked Amount")
   
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getBookedAmtMonDet", monthClass);
    else if (monthClass.serviceType === "Internal Spent")
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getIntMonBkdDet", monthClass);
    else if (monthClass.serviceType === "Invoice Amount")
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getInvMonBkdDet", monthClass);
    else if (monthClass.serviceType === "PO Amount")
     
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getPoMonBkdDet", monthClass);
    else if (monthClass.serviceType === "PR Amount")
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getPrMonBkdDet", monthClass);
    else if (monthClass.serviceType === "Receipt Amount")
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgeTracking/v1/getRcptMonBkdDet", monthClass);
    else return;
  }

  budgetBookingApproveReject(BudgetBooking:any) {
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    if (BudgetBooking.approveRejectStatus === true)
      
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/approved", BudgetBooking);
    else
     
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/rejected", BudgetBooking);
  }

  budgetBookingCancel(BudgetBooking:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/cancel",BudgetBooking);
  }

  L2BookingApproveReject(L2Approval:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/L2Approval",L2Approval);
  }

  getAllAttachements(bbheaderID:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getAllDocument",bbheaderID);
  }

  getAttachements(attachementID:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/getDocument",attachementID);
  }

  updateAttachements(updateAttachement:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/updateAttachement",updateAttachement);
  }

  removeAttachement(updateAttachement:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/removeAttachement",updateAttachement);
  }

  deleteBB(deleteBudgetBooking:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/DeleteBB",deleteBudgetBooking);
  }

  UpdateDraftBB(deleteBudgetBooking:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/UpdateBB",deleteBudgetBooking);
  }

  resendEmail(bbheaderID:any) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/resendEmail", bbheaderID);
  }

  myPendingApproval(requestorName:any) {
   
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/budgetBooking/v1/myPendingApproval", requestorName , { headers });
  }

  spendMonthlyWise(objDashboard: Dashboard) {
    
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/spendMonthlyWise", objDashboard , { headers});
  }

  budgetBalance(objDashboard: Dashboard) {
    console.log(objDashboard);
    const username = 'BBFApi';
    const password = 'BudgetB00k!ngF0rm';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

    // Set the headers for the HTTP request
    const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    });
    
    
    return this.http.post('https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/budgetBalance', objDashboard,
      { headers });
  }

  functionOverview(objDashboard: Dashboard) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/functionOverview", objDashboard,
      { headers });
  
  }

  functionL2Overview(objDashboard: Dashboard) {
    
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/functionL2Overview", objDashboard , { headers });
  }
  
  updatePOAmount(objUpdatePOAmount : UpdatePOAmount){
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/POLineupdate", objUpdatePOAmount);
  }

  addPOAmount(objAddPOAmount: AddPOAmount){
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/addPoLine", objAddPOAmount);
  }

  updateDate(objUpdateChange: UpdateChange) {
     const headers = new HttpHeaders({
      "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
      "X-Requested-With": "XMLHttpRequest",
      'Content-Type': 'application/json',
    })
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/common/v1/UpdateDate", objUpdateChange);
  }
}
