import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('request is on its way'); //the code that is run right before the request leaves the app

        const modifiedReq=req.clone({
            headers:req.headers.append('Auth','xyz')  //here we are creating a new request and appending headers from the old one
                                                    //plus adding a new header-which doesn't do anything
                                                    //but will be created for each and every request
        });

      // return next.handle(modifiedReq); //we let the request to continue and 
       //we should actually return the result to really let it continue
       //if we don't return it and pass the request then the reuest will not continue and therefore the app will break


       return next.handle(modifiedReq);
    }

}  