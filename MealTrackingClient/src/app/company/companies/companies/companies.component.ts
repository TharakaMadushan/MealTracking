import { RepositoryService } from 'src/app/shared/services/repository.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Company } from 'src/app/_Interfaces/company.model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  public companies: Company[] | undefined;

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies = () => {
    const apiAddress: string = "api/companies";
    this.repository.getData(apiAddress)
    .subscribe({
      next: (com: Company[]) => this.companies = com,
      error: (err: HttpErrorResponse) => console.log(err)
    })
  }
}
