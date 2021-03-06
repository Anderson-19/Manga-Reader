import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MangaService } from '../../services/user_service/manga.service';
import { ChapterServicesService } from '../../services/chapter-services/chapter-services.service';
import { CommentsService } from '../../services/chapter-services/comments.service';  
import { MessagesService } from '../../services/messages/messages.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-view-manga',
  templateUrl: './view-manga.page.html',
  styleUrls: ['./view-manga.page.scss'],
})
export class ViewMangaPage implements OnInit {
 
  public manga: any = [];
  public view_manga: any = [];
  public data: any = [];
  public name_chapter: any =[];
  public chapters: any = [];
  public chapter: any = [];
  public response: any = [];
  public bool: boolean = false;
  public verify: boolean = false;
  public text: any = [];

  constructor(
    private mangaService: MangaService,
    private messageService: MessagesService,
    private router: Router,
    private store: Store,
    private charpterService: ChapterServicesService,
    private commentService: CommentsService 
    ) { }

  ngOnInit() {
    this.getManga();
    let {manga_id} = this.store.snapshot();
    if(manga_id.manga_id){
      this.getCharpter(manga_id.manga_id);
    }
  }
  

  public toSubcribe(){
    let {manga_id, token} = this.store.snapshot();
    if(manga_id && token){
      this.mangaService.toSubcribe(manga_id.manga_id, token.token).subscribe(
        res =>{
          this.response = res;
          if(this.response.verify){
            this.messageService.presentToast('success','Successful subscription');
          }else{
            this.messageService.presentToast('danger','Invalid subscription');
          }     
        },
        err => {
          this.messageService.presentToast('danger','Invalid subscription');
          console.log(err)
        }
      )
    }
  }

  public getCharpter(id: string | number){
    this.charpterService.getCharpter(id).subscribe(
      res =>{
        this.chapters = res;
        this.name_chapter = this.chapters.content;
        this.bool = true;
        this.getComments()
      },
      err => console.log(err)
    )
  }

  public getManga(){
    let {manga_id} = this.store.snapshot();
    if(manga_id.manga_id){
      this.mangaService.getManga(manga_id.manga_id).subscribe(res =>{
          this.manga = res;
          this.view_manga = this.manga.content[0];
      },
      err => {
        console.log(err);
      });
    }
  }

  public deleteChapter(id: string | number){
    let manga_id = id;
    if(manga_id){
      this.charpterService.deleteCharpter(manga_id).subscribe(
        res =>{
          this.getCharpter(manga_id);
        },
        err => console.log(err)
      )
    }
  }

  public viewChapter(id: string | number){
    this.charpterService.getCharpter(id).subscribe( res =>{
      this.router.navigate([`/view-chapter/${id}`]);
    },
    err => console.log(err))
  } 

  public getComments(){
    this.commentService.getComments().subscribe(
        res =>{
          this.data = res;
          this.text = this.data.content;
          console.log(this.text)
        },
        err => console.log(err)
      ) 
  }

  public commentChapter(id: string | number){
    this.router.navigate([`/comment-creation/${id}`]);
  }
  
  public deleteComment(id: string | number){
    if(id){
      this.commentService.deleteComment(id).subscribe(
        res =>{
          this.getComments();
        },
        err => console.log(err)
      )
    }  
  }

}
