import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { config } from '../../config/config';
import { DirectoryModel } from '../../models/directory.model';
import * as moment from 'moment';
import { _ } from 'underscore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-directory-page',
  templateUrl: './directory.component.html'
})
export class DirectoryComponent implements OnInit {
  directories: DirectoryModel[] = [];
  animalTypes = [{ id: null, name: 'Select One' }];
  states = [{ id: null, name: 'Select One' }];
  breeds = [{ id: null, name: 'Select One' }];
  filters = {};
  searchText = "";
  searchModel: any = { state: null, animalType: null, breed: null, farmName: '' };
  rootImgPath: any = config.imgPath;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router
    , public _loaderService: LoaderService) {
  }

  ngOnInit() {
    this.getDirectories();
    this.getAnimalTypes();
    this.getStates();
  }

  getDirectories() {
    this._loaderService.show();
    this.http.get<DirectoryModel[]>(config.ServiceUrl + '/api/gateway/GetAnimalDirtory', this.httpOptions).subscribe((data) => {
      this.directories = data != null ? data.map(a => new DirectoryModel(a)) : [];
      this._loaderService.hide();
    });
  }

  getAnimalTypes() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetAnimaltypes', this.httpOptions).subscribe((data: any) => {
      this.animalTypes = data;
      this.animalTypes.push({ id: null, name: 'Select One' });
      this._loaderService.hide();
    });
  }

  getStates() {
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetStates', this.httpOptions).subscribe((data: any) => {
      this.states = data;
      this.states.push({ id: null, name: 'Select One' });
      this._loaderService.hide();
    });
  }

  getBreeds(animalTypeId) {
    this.breeds = [{ id: null, name: 'Select One' }];
    this.searchModel.breed = null;
    
    if (animalTypeId > 0) {
      this._loaderService.show();
      this.http.get(config.ServiceUrl + '/api/gateway/GetBreeds?animaltypeId=' + animalTypeId, this.httpOptions).subscribe((data: any) => {
        this.breeds = data;
        this.breeds.push({ id: null, name: 'Select One' });
        this._loaderService.hide();
      }, error => {
        this._loaderService.hide();
      });
    }
  }

  viewDirectoryDetails(directory) {
    if (directory.id) {
      this.router.navigate(['/directory/' + directory.name])
    }
  }

  search() {
    this.getDirectories();
  }
}
