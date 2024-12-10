import {
    Injectable
} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor
} from '@angular/common/http';
import {
    Observable
} from 'rxjs';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(request: HttpRequest < any > , 
        next: HttpHandler): Observable < HttpEvent < any >> {
        if(request.url.toString().indexOf("https://mafptawasul.maf.ae") == -1 )
        {    
                request = request.clone({
                    headers: new HttpHeaders({
                        Authorization: 'Basic QkJGQXBpOkJ1ZGdldEIwMGshbmdGMHJt',
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                    })
                });
        }
        return next.handle(request);
    }
}