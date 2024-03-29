import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  //public claims: [] = [];
  public claims: { type: string, value: string }[] = [];

  constructor(private _repository: RepositoryService) { }

  ngOnInit(): void {
    this.getClaims();
  }

  public getClaims = () =>{
    this._repository.getClaims('api/companies/privacy')
    .subscribe(res => {
      this.claims = res as [];
    })
  }
}
