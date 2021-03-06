import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MangaService } from '../../services/user_service/manga.service';
import { Store} from '@ngxs/store'; 
import { SetManga } from '../../store/manga/manga.action';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public mangas: any = [];
  public verify: boolean = false;
  public publicKey: string = "BHHIVJmHPAZcH2Vr5LH6zBC3dKb-ACgx5ba4RLszGrt00Rs9TcNk_fYNVOMWbmXOdzqKbyfxA4UxNOpVyvImlQI";
  public response: any;

  constructor(
    private mangaService: MangaService,
    private router: Router,
    private store: Store
    ) { }

  ngOnInit() {
    this.getMangas()
  }

  public getMangas(){
    this.mangaService.getMangas().subscribe(res =>{
      this.mangas = res;
    },
    err => {
      console.log(err);
    });
  }

  public deleteManga(id: string | number){
    this.mangaService.deleteManga(id).subscribe(
      res =>{
        this.getMangas();
      },
      err => console.log(err)
    )
  }

  public viewManga(id: string | number){
    this.mangaService.getManga(id).subscribe( res =>{
      this.store.dispatch(new SetManga(id));
      this.router.navigate([`/view-manga/${id}`]);
    },
    err => console.log(err)
    ) 
  } 
  
}
