import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  
  constructor(private http:HttpClient) { }

  createAndStorePosts(title:string, content:string){
    const postData:Post={title:title, content:content};
    this.http
    .post<{name:string}>('https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json', postData)
    .subscribe(responseData=>{
      console.log(responseData);
    });
    console.log(postData);
  }
  
  fetchPosts(){
    
    return this.http.get<{[key:string]:Post}>('https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json')
    .pipe(map(responseData=>{
      const postsArray:Post[]=[];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key))
        {
          postsArray.push({...responseData[key], id:key})
        }
      }

      return postsArray;
    })
    );
  }
}
