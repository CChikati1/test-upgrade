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
   const excludedUrls = [
    "https://mafptawasul.maf.ae",
    "https://majidalfuttaim.sharepoint.com/sites/SMBU",
  ];
  
  const isExcluded = excludedUrls.some((url) => req.url.startsWith(url));
        if(!isExcluded)
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