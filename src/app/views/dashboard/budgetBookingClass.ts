export class BudgetBooking {  
    id:number;   
    bbNumber: string;
    bbStatus:string;
    requestedBy: string;
    currency: string;
    exchangeRate: number;
    exchangeRateType: string;
    exchangeRateDate: string;
    justification: string;   
    lastUpdatedDate: string;
    lastUpdatedBy: string;
    createdOn: string;
    createdBy: string;
    poRequired: string; 
    remarks:string;
    approveRejectStatus:boolean;
    lineType: string;
    budgetStatus: string;
    vendorId: number; 
    vendorSiteId: number; 
    needByDate: string;
    projectType: string; 
    description: string;  
    attachment: string;  
    TOTAL:number;
    KNOWN_NAME: string;
    procurementSourcing: string;
    buyerValue: string;
    buyerDesc: string;
    projectValue: string;
    projectValueDesc: string;
    projectTypesValue: string;
    projectTypesDesc: string;
    justifySSEmergency: string;
    goodServicesDelivered: string;
    invoiceReceived: string;
    paymentTermsValue: string;
    paymentTermsDesc: string;
    justifyDeviationPymtTerms: string;
    projectDetails: string;
    aribaAwardedValue: string;
    aribaAwardedDesc: string;
}

export class BudgetBookingApproval{
    approvedFlag: string;
    approvedId: number;
    comments: string;
    id: number;
    sequence: number;
    userName: string;
    approveRejectStatus:boolean;
    createdBy: string;
}

export class BudgetBookingLines {  
    id:number;   
    allocatedBudget: number;
    availableActual:number;
    availableBudget: number;
    bbheaderId: number;
    budgetStatus: string;
    creadtedBy: string;
    createdDate: string;
    justification: string;   
    lineAmount: number;
    lineType: string;
    needByDate: string;
    nextYearBBAmount: number;
    poetNumber: string; 
    projectName: string; 
    projectType: string; 
    quantity: number; 
    unitPrice: number; 
    uom: string; 
    updateDate: string; 
    updatedBy: string; 
    vendorId: number; 
    vendorSiteId: number; 
    level1:string;
    level2:string;
    level3:string;
    level4:string;
    vendorName: string; 
    vendorSiteName: number; 
    chargeAccount: string;
    dummyPoet: string;
    lineDescription: string;
    YEARLYBUDGET:number;
    BALANCE:number;
}

export class travelPoet {
    hotel: number;
    airTicket: number;
    mealsEntertainment: number;
    expenses: number;
}

export class CurrencyRate {  
   
    date: string; 
    fromCurrency: string; 
}

export class VendorSite {  
   
    currencyCode: string; 
    vendorID: number; 
}

export class VendorSiteDetails {  
   
    siteName: string; 
    siteId: number; 
}

export class Vendor {  
   
    vendorName: string; 
    supplierId: number; 
}


export class BudgetPoetNumber {  
   
    poetNumber: string;  
    year: string;
}

export class BudgetPoetId {  
   
    id: number;  
}

export class BudgetAmount {  
   
    fullBudget: number;  
    usedBudget: number;  
    yearlyBudget: number;  
    availableActual: number;
    holdingPercentage: number;
    venturesPercentage: number;
    propertiesPercentage: number;
    retailPercentage: number;
    othersPercentage: number;
}



export class RequestHeader {
    ConsumerTransactionId: string;
    Consumer: string;
    TransactionDateTime: Date;
}

export class DocumentInfo {
    ContactID: string;
    ContractID: string;
    OrganizationID: string;
    PropertyID: string;
    IncidentID: string;
    File: string;
    Description: string;
    FileName: string;
    Type: string;
    SourceURL: string;
    Application: string;
    Platform: string;
    FolderName: string;
}

export class Documents {
    DocumentInfo: DocumentInfo[];
}

export class RootObject {
    RequestHeader: RequestHeader;
    Documents: Documents;
}



export class BudgetAttachment {
    base64: string;
    type: string; 
    name:string;
}

export class BudgetAttachments {
   fileName : string;
}

export class updateAttachement{
    bbHeaderId: number;
    id: number;
}

export class L2Approval {
    bbHeaderId: number;
    approvalId: number;
    actionBy: string;
    actionType: string;
}

export class DeleteBudgetBooking { 
    bbHeaderID: number;
    comments: string;
}