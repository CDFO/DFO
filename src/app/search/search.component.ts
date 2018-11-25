import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CatalogueService } from '../_services/catalog.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Global } from '../global';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResults: object;
  queryField: FormControl = new FormControl();
  constructor(
    private catalogue : CatalogueService,
    private global : Global
  ) { }

  ngOnInit() {
    this.queryField.valueChanges
    .pipe(debounceTime(200))
    .pipe(distinctUntilChanged())
    .pipe(switchMap((query) =>  this.catalogue.getCataloguesForSearch(query)))
    .subscribe( data => {  
      var array = this.global.generateArray(data); 
      for (let key1 in array) {
        array[key1].profile = this.global.jsonFormating(array[key1].profile);
      }
      this.searchResults = array;
    });
  }

  closeSearchList(){
    this.searchResults = null;
    (document.getElementById('keyword') as HTMLInputElement).value = '';
  }
}
