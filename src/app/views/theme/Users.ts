

export class User{   
    poet_master_id:number;
    userName : string ;
    teamName : string ;
    startDate : string ;
    endDate : string ;

    //UsersData : Users[] ; 
    id: number;
    isActive:string;
    emailId : string ;
}

// export class User{   
//     POET_MASTER_ID:number;
//     USER_NAME : string ;
//     TEAM_NAME : string ;
//     START_DATE : string ;
//     END_DATE : string ;

//     //UsersData : Users[] ; 
//     USER_ASSIGNMENTS_ID: number;
//     IS_ACTIVE:string;
// }

export class Users{   
    SelectedUser : string ;
    StartDate : string ;
    EndDate : string ;

}


export class cmbUser{    
    fullName : string ;
    knownName : string ;
    personID : number ;
    userID : number ; 
    userName: string;
    manager: string;
    finalApprover: string;
    finalApproverLimit: number;
    emailAddress: string;
    mgrEmail: string;
    teamName: string; 
    createdBy:string;
    lastUpdateBy:string;
}
