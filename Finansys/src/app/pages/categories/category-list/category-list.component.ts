import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private service: CategoryService) { }

  ngOnInit() {
    this.service.getAll().subscribe(
      categories => this.categories = categories,
      error => alert(`error: ${error}`)
    )
  }

  delete(category){
    if(confirm('Deseja realmente excluir esse item?')){
      this.service.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => alert("erro")
      )
    }
  }

}
