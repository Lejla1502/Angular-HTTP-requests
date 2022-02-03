import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { title } from 'process';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  loadedPosts:Post[] = [];
  isFetching=false;
  error=null;

  constructor(private http: HttpClient, private postService:PostsService) {}

  private errorSub:Subscription;

  ngOnInit() {
    this.errorSub=this.postService.error.subscribe(
      errorMessage=>{
        this.error=errorMessage;
      }
    );
    
    this.isFetching=true;
    this.postService.fetchPosts().subscribe(posts=>{
      this.isFetching=false;
      this.loadedPosts=posts;
    }, error=>{
      this.error=error.message;
    });
  }

  ngAfterViewInit()
  {
    this.errorSub=this.postService.error.subscribe(
      errorMessage=>{
        this.error=errorMessage;
        console.log("Done");
      }
    );
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createAndStorePosts(postData.title,postData.content);
    this.loadedPosts.push(postData);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching=true;
    this.postService.fetchPosts().subscribe(posts=>{
      this.isFetching=false;
      this.loadedPosts=posts;
    }, error=>{
      this.error=error.message;
    });;
  }

  onClearPosts() {
    // Send Http request
    this.postService.clearPosts().subscribe(()=>{
      this.loadedPosts=[];
    });
  }

  ngOnDestroy(): void {
      this.errorSub.unsubscribe();
  }
}
