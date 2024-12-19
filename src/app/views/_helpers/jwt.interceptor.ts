import {
    Injectable
} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
    HttpInterceptorFn
} from '@angular/common/http';
import {
    Observable
} from 'rxjs';
export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
   
        if(req.url.toString().indexOf("https://mafptawasul.maf.ae") == -1  && req.url.toString().indexOf("https://majidalfuttaim.sharepoint.com/sites/SMBU") == -1)
        {    
                req = req.clone({
                    headers: new HttpHeaders({
                        Authorization: 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                    })
                });
        }
        return next(req);
    
}