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

import {sp, spPost, SharePointQueryable } from '@pnp/sp/presets/all';
sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },
    baseUrl:environment.sp_URL 
  },
});


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
    return this.http.get(this.Root_URL+"common/v1/getMasterData" );
  }

  public getFinanceCategories() {
    return this.http.get(this.Root_URL+"common/v1/getFinanceCategories");
  }

  public getUsers() {
    return this.http.get("https://mafhbudgettrackerapi.maf.ae/api/common/v1/getUsers");
  }
  
  getUserName_online() {
    return sp.web.currentUser.get();
  }
  getUserName() {
    return this.http.get(this.sp_URL + "_api/Web/CurrentUser", { headers: { Accept: "application/json;odata=verbose" } });
  }

  getEmployee(empEmail:any) {
    return this.http.get(this.sp_URL +"_api/web/lists/getByTitle('Employee')/items?$filter=Title eq '" + empEmail + "'", { headers: { Accept: "application/json;odata=verbose" } });
  }

  savePoet(PoetClass: PoetClass) {
    if (PoetClass.poetId > 0)
      return this.http.post<PoetClass>(this.Root_URL+"POET/v1/update", PoetClass);
    else
      return this.http.post<PoetClass>(this.Root_URL+"POET/v1/save", PoetClass);
  }

  getPoet(year: String, email: String) {
    let objGetPoetDTO: GetPoetDTO;
    objGetPoetDTO = new GetPoetDTO()
    objGetPoetDTO.year = year;
    objGetPoetDTO.email = email;
     
    return this.http.post(this.Root_URL+"POET/v1/get", objGetPoetDTO);
  }

  savecmbUsers(cmbUser: cmbUser) {
    
    if (cmbUser.userID > 0)
      return this.http.post<PoetClass>(this.Root_URL+"cmbUsers/v1/updateCMBUsers", cmbUser);
    else
      return this.http.post<PoetClass>(this.Root_URL+"cmbUsers/v1/insertCMBUsers", cmbUser);
  }

  getcmbUsers() {
    
    return this.http.get(this.Root_URL+"cmbUsers/v1/getCMBUsers");
  }

  getBudget(year: String) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getAllBB", year);
  }

  getPendingApproval() {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/PendingApproval", "");
  }

  createPR(id:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/createPR", id);
  }

  getBBPendingApproval(id:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/BBPendingApproval", id);
  }

  getBudgetbyUser(user:any, isAdmin: boolean, year: string) {
    if (isAdmin) {
       
    return this.http.post(this.Root_URL+"budgetBooking/v1/getAllBB", year);
    } else {
      let objBudgetUserYear: BudgetUserYear = new BudgetUserYear();
      objBudgetUserYear.year = year
      objBudgetUserYear.userName = user
       
    return this.http.post(this.Root_URL+"budgetBooking/v1/getAllBBbyUser", objBudgetUserYear);
    }
  }

  getBBbyId(bbheaderID:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getBBbyId", bbheaderID);
  }

  getCMBUser(emailAddress:any){
     
    return this.http.post(this.Root_URL+"common/v1/getCMBUser", emailAddress);
  }

  getApprovalDetails(id:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getApprovalDetails", id);
  }


  getCancellationDetails(id:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getCancellationDetails", id);
  }


  getBudgetLines(BudgetBooking:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getBBlines", BudgetBooking);
  }

  public saveBudget(BudgetBooking: BudgetBooking) {
    
    if (BudgetBooking.id > 0)
      
    return this.http.post(this.Root_URL+"budgetBooking/v1/UpdateDataBB", BudgetBooking);
    else
       
    return this.http.post(this.Root_URL+"budgetBooking/v1/SaveDataBB", BudgetBooking);
  }

  public sendApproval(budget:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/sendApproval", budget);
  }

  public getApprovalList(id:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getApprovalList", id);
  }

  public saveBudgetLines(BudgetBookingLines: BudgetBookingLines) {
    
    if (BudgetBookingLines.id > 0)
      
    return this.http.post(this.Root_URL+"budgetBooking/v1/UpdateDataBBLines", BudgetBookingLines);
    else
    
    return this.http.post(this.Root_URL+"budgetBooking/v1/SaveDataBBLines", BudgetBookingLines);
  }

  public getTeams() {
    
    return this.http.get(this.Root_URL+"common/v1/getTeamName");
  }

  public getVendors() {
    return this.http.get(this.Root_URL+"common/v1/getVendor");
  }

  public getAriba() {
    return this.http.get(this.Root_URL+"common/v1/getAriba");
  }

  public getPaymentTerms() {
    return this.http.get(this.Root_URL+"common/v1/getPaymentTerms");
  }

  public getProjectValue() {
    return this.http.get(this.Root_URL+"common/v1/getProjectValue");
  }

  public getProjectTypes(projectValue: string) {
     
    return this.http.post(this.Root_URL+"common/v1/getProjectTypes", projectValue);
  }

  public getBuyer(procrumentValue: string) {
     
    return this.http.post(this.Root_URL+"common/v1/getBuyer", procrumentValue);
  }

  public getVendorsSites(VendorSite:any) {
     
    return this.http.post(this.Root_URL+"common/v1/getVendorSite", VendorSite);
  }

  public getBudgetAmount(BudgetPoetNumber:any) {
     
    return this.http.post(this.Root_URL+"common/v1/getBudgetAmount", BudgetPoetNumber);
  }

  public getCurrency() {
    return this.http.get(this.Root_URL+"common/v1/getCurrencyCode");
  }

  public getCurrencyRate(CurrencyRate:any) {
     
    return this.http.post(this.Root_URL+"common/v1/getRate", CurrencyRate);
  }

  public saveUserData(user: User) {
    //if (user.id > 0)
       
    //return this.http.post(this.Root_URL+"POET/v1/UpdatePoetUserAssignment", user);
    //else
       
    return this.http.post(this.Root_URL+"POET/v1/SavePoetUserAssignment", user);
  }

  public deleteUserData(user: User) {
     
    return this.http.post(this.Root_URL+"POET/v1/deletePoetUserAssignment", user);
  }

  public fileUpload(BudgetAttachment:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/UploadDocument", BudgetAttachment);
  }

  public getPoetUserData(user:any) {
     
    return this.http.post(this.Root_URL+"POET/v1/getPoetUserAssignment", user);
  }

  public getUserBudgetData(user:any) {
     
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/showUserBudgetData", user);
  }

  saveMonthwisePoet(monthClass: MonthClass) {
    
    if (monthClass.id > 0)
      
    return this.http.post(this.Root_URL+"budgetEntry/v1/update", monthClass);
    else
     
    return this.http.post(this.Root_URL+"budgetEntry/v1/save", monthClass);
  }

  getMonthwisePoet(year: String, email: String) {
    let objGetPoetDTO: GetPoetDTO;
    objGetPoetDTO = new GetPoetDTO()
    objGetPoetDTO.year = year;
    objGetPoetDTO.email = email;
     
    return this.http.post(this.Root_URL+"budgetEntry/v1/get", objGetPoetDTO);
  }

  getBudgetTrackingData(year: String, email: String) {
    let objGetPoetDTO: GetPoetDTO;
    objGetPoetDTO = new GetPoetDTO()
    objGetPoetDTO.year = year;
    objGetPoetDTO.email = email;
     const url=this.Root_URL+"";
    return this.http.post(url+"budgeTracking/v1/get", objGetPoetDTO);
  }

  getBudgetTrackingPoetData(monthClass: MonthClass) {
     
    return this.http.post(this.Root_URL+"budgeTracking/v1/getPoetDetails", monthClass);
  }

  getBudgetTrackingMonthwiseData(monthClass: MonthClass) {
     
    return this.http.post(this.Root_URL+"budgeTracking/v1/getMonthlySummmary", monthClass);
  }

  getBudgetTrackingMonthwiseHistory(monthClass: MonthClass) {
    
    if (monthClass.serviceType === "Allocated Budget")
      
    return this.http.post(this.Root_URL+"budgeTracking/v1/getAllocatedAmtMonDet", monthClass);
    else if (monthClass.serviceType === "Booked Amount")
   
    return this.http.post(this.Root_URL+"budgeTracking/v1/getBookedAmtMonDet", monthClass);
    else if (monthClass.serviceType === "Internal Spent")
      
    return this.http.post(this.Root_URL+"budgeTracking/v1/getIntMonBkdDet", monthClass);
    else if (monthClass.serviceType === "Invoice Amount")
      
    return this.http.post(this.Root_URL+"budgeTracking/v1/getInvMonBkdDet", monthClass);
    else if (monthClass.serviceType === "PO Amount")
     
    return this.http.post(this.Root_URL+"budgeTracking/v1/getPoMonBkdDet", monthClass);
    else if (monthClass.serviceType === "PR Amount")
      
    return this.http.post(this.Root_URL+"budgeTracking/v1/getPrMonBkdDet", monthClass);
    else if (monthClass.serviceType === "Receipt Amount")
      
    return this.http.post(this.Root_URL+"budgeTracking/v1/getRcptMonBkdDet", monthClass);
    else return;
  }

  budgetBookingApproveReject(BudgetBooking:any) {
    
    if (BudgetBooking.approveRejectStatus === true)
      
    return this.http.post(this.Root_URL+"budgetBooking/v1/approved", BudgetBooking);
    else
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/rejected", BudgetBooking);
  }

  budgetBookingCancel(BudgetBooking:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/cancel",BudgetBooking);
  }

  L2BookingApproveReject(L2Approval:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/L2Approval",L2Approval);
  }

  getAllAttachements(bbheaderID:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getAllDocument",bbheaderID);
  }

  getAttachements(attachementID:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/getDocument",attachementID);
  }

  updateAttachements(updateAttachement:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/updateAttachement",updateAttachement);
  }

  removeAttachement(updateAttachement:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/removeAttachement",updateAttachement);
  }

  deleteBB(deleteBudgetBooking:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/DeleteBB",deleteBudgetBooking);
  }

  UpdateDraftBB(deleteBudgetBooking:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/UpdateBB",deleteBudgetBooking);
  }

  resendEmail(bbheaderID:any) {
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/resendEmail", bbheaderID);
  }

  myPendingApproval(requestorName:any) {
   
     
    return this.http.post(this.Root_URL+"budgetBooking/v1/myPendingApproval", requestorName );
  }

  spendMonthlyWise(objDashboard: Dashboard) {
    
     
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/spendMonthlyWise", objDashboard );
  }

  budgetBalance(objDashboard: Dashboard) {
    // const username = 'BBFApi';
    // const password = 'BudgetB00k!ngF0rm';
    // const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

    // Set the headers for the HTTP request
    // const headers = new HttpHeaders({
    //   "Authorization": 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
    //   "X-Requested-With": "XMLHttpRequest",
    //   'Content-Type': 'application/json',
    // });
    
    
    return this.http.post('https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/budgetBalance', objDashboard);
  }

  functionOverview(objDashboard: Dashboard) {
     
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/functionOverview", objDashboard);
  
  }

  functionL2Overview(objDashboard: Dashboard) {
    
     
    return this.http.post("https://mafhbudgettrackerapi.maf.ae/api/dashboard/v1/functionL2Overview", objDashboard );
  }
  
  updatePOAmount(objUpdatePOAmount : UpdatePOAmount){
     
    return this.http.post(this.Root_URL+"common/v1/POLineupdate", objUpdatePOAmount);
  }

  addPOAmount(objAddPOAmount: AddPOAmount){
     
    return this.http.post(this.Root_URL+"common/v1/addPoLine", objAddPOAmount);
  }

  updateDate(objUpdateChange: UpdateChange) {
     
    return this.http.post(this.Root_URL+"common/v1/UpdateDate", objUpdateChange);
  }
}
