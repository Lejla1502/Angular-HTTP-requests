import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService  {

  error=new Subject<string>();

  constructor(private http:HttpClient) { }

  createAndStorePosts(title:string, content:string){
    const postData:Post={title:title, content:content};
    this.http
    .post<{name:string}>('https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json', postData,
    {
      observe:'response'
    })
    .subscribe(responseData=>{
      console.log(responseData);
    }, error=>{
      this.error.next(error.message);
      
    });
    console.log(postData);
  }
  
  fetchPosts(){
    let searchParams=new HttpParams();
    searchParams=searchParams.append('print','pretty');
    searchParams=searchParams.append('custom','key');
    return this.http.get<{[key:string]:Post}>(
      'https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-header':'Hello'}),
        params: searchParams //new HttpParams().set('print', 'pretty') - for a single param
      })
    .pipe(map(responseData=>{
      const postsArray:Post[]=[];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key))
        {
          postsArray.push({...responseData[key], id:key})
        }
      }
  
      return postsArray;
    }),
    catchError(errorRes=>{
      return throwError(errorRes);
    })
    );
  }

  clearPosts()
  {

    return this.http.delete('https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json',{
      observe:'events'
    }).pipe(
      tap(event=>{
        console.log(event);
        if(event.type===HttpEventType.Sent){
          //..
        }
        if(event.type===HttpEventType.Response){
          console.log(event.body);
        } 
      })
    );
  }

 
}
