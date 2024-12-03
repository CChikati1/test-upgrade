export class MasterPOET {
    financialYear: number;
    createdBy: string;
    creationDate: string;
    lastUpdateBy: string;
    lastUpdatedate: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    poetId: number;
    poetNumber: string;
    projectName: string;
    projectType: string;
    itemCategoryId: number;
    ownerName: string;
    reviewer1: string;
    reviewer2: string;
    startDate: string;
    itemCategoryName: string;
}

export class Dashboard {
    year: string;
    spendType: string;
    email: String;
    month: String;
    projectCategory: String;
    department: String;
}

export class BudgetUserYear {
    year: string;
    userName: string;
}

export class UpdatePOAmount {
    bbLineId: number;
    remarks: string;
    updateAmount: number;
    updatedBy: string;
    creadtedBy: string;
}

export class AddPOAmount {
    remarks: string;
    updatedBy: string;
    creadtedBy: string;
    bbHeaderId: number;
    poetNumber: string;
    projectName: string;
    allocatedBudget: number;
    availableBudget: number;
    availableActual: number;
    quantity: number;
    unitPrice: number;
    lineAmount: number;
}

export class UpdateChange {
    bbHeaderId: number;
    remarks: string;
    updatedBy: string;
    creadtedBy: string;
    updatedDate: string;
}