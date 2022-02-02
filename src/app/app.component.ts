import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { title } from 'process';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts:Post[] = [];
  isFetching=false;

  constructor(private http: HttpClient, private postService:PostsService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createAndStorePosts(postData.title,postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts(){
    this.isFetching=true;
    this.http.get<{[key:string]:Post}>('https://ng-complete-guide-e6189-default-rtdb.firebaseio.com/posts.json')
    .pipe(map(responseData=>{
      const postsArray:Post[]=[];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key))
        {
          postsArray.push({...responseData[key], id:key})
        }
      }

      return postsArray;
    }))
    .subscribe(posts=>{
      this.isFetching=false;
      this.loadedPosts=posts;
    });
  }
}
