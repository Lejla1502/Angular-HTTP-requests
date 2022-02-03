import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
    .post<{name:string}>('https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json', postData)
    .subscribe(responseData=>{
      console.log(responseData);
    }, error=>{
      this.error.next(error.message);
      
    });
    console.log(postData);
  }
  
  fetchPosts(){
    
    return this.http.get<{[key:string]:Post}>(
      'https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-header':'Hello'})
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

    return this.http.delete('https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json');
  }

 
}
