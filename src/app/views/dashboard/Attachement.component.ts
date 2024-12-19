import { Component, OnInit, AfterViewInit, Injectable, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
// import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NgbModalConfig, NgbModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Select2OptionData } from 'ng-select2';
import { ChangeDetectionStrategy } from '@angular/core';
import { BudgetBookingApproval, BudgetBooking, Vendor, VendorSite, VendorSiteDetails, BudgetPoetNumber, BudgetAmount, RootObject, Documents, RequestHeader, DocumentInfo, BudgetPoetId } from './budgetBookingClass';
import { BudgetBookingLines } from './budgetBookingClass';
import { CurrencyRate } from './budgetBookingClass';

import { DataTableDirective } from 'angular-datatables';
import { PoetClass } from './PoetClass';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

declare const $:any;
@Component({
    templateUrl: 'Attachement.component.html',
    providers: [NgbModalConfig, NgbModal]

})
export class AttachementComponent implements OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    private assetInputElRef: ElementRef;
    @ViewChild('assetInput') set assetInput(elRef: ElementRef) {
        this.assetInputElRef = elRef;
    }

    attachementID: string;

    loginUserName: string = "Test@test.com";
    EMAIL_ADDRESS: string = "";
    applyHideClassForBooking: boolean = true;
    isBtnApprvEnabled: boolean = false;

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private frmbuilder: FormBuilder, private toastr: ToastrService, private chRef: ChangeDetectorRef, private fb: FormBuilder, config: NgbModalConfig, private spinner: NgxSpinnerService, private modalService: NgbModal, private calendar: NgbCalendar, private service: ApiService) {
        // customize default values of modals used by this component tree
        config.backdrop = 'static';
        config.keyboard = false;
        this.route.queryParams.subscribe(params => {
            this.attachementID = params['attachementID'];
        });
        this.downloadFile();
    }

    // displayToConsole(datatableElement: DataTableDirective): void {
    //     datatableElement.dtInstance.then((dtInstance: DataTables.Api) => console.log(dtInstance));
    // }

    ngOnInit() {
    }

    getUserName() {
        this.service.getUserName().subscribe((res) => {
            if (res != null && res != '') {
                let user = res as any;
                this.loginUserName = user.d.Email;
            }
        });
    }

    downloadFile() {
        let attachmentId : any = { "attachementId" : this.attachementID };
        this.service.getAttachements(attachmentId).subscribe(res => {
            debugger;
            let response: any = res;
            let byteCharacters = atob(response.imageData);
            let byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++)
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            let byteArray = new Uint8Array(byteNumbers);
            let file = new Blob([byteArray], { type: response.fileType });
            let fileURL = URL.createObjectURL(file);
            let windowsVariable: any;
            windowsVariable = window.navigator;
            if (windowsVariable.msSaveOrOpenBlob)
                windowsVariable.msSaveBlob(file, response.fileName);
            else {
                var anchor = document.createElement("a");
                anchor.download = response.fileName;
                anchor.href = fileURL;
                anchor.click();
            }
            //window.open(fileURL,'_blank');
        });
    }

    public handleRefusalData(dismissMethod: string): void {
    }





}


