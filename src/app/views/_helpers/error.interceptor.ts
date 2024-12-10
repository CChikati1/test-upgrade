import {
    Injectable
} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import {
    Observable,
    throwError
} from 'rxjs';
import {
    catchError
} from 'rxjs/operators';
import {
    Router
} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router:Router) {}

    intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
        return next.handle(request).pipe(catchError(err => {
          
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.router.navigate(['/doa/unauthorised/0']);
                //location.reload(true);
                return throwError(err);

            }
            if (err.status === 403) {
                // auto logout if 401 response returned from api
                this.router.navigate(['/doa/unauthorised/1']);
                //location.reload(true);
                return throwError(err);

            }
            //if (!err.ok) {
                // auto logout if 401 response returned from api
              //  this.router.navigate(['/doa/unauthorised/2']);
                //location.reload(true);

            //}
            return throwError(err);
                        
        }))
    }
}