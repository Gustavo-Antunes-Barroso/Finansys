import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {ActivatedRoute, Router} from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})

export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string = '';
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
      if(this.currentAction === 'new'){
        this.createCategory();
      }
      else{
        this.updateCategory();
      }
  }

  //PRIVATE METHODS
  private setCurrentAction(){
    if(this.route.snapshot.url[0].path === 'new')
      return this.currentAction = 'new'

    return this.currentAction = 'edit'
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(5)]],
      description: [null]
    });
  }

  private loadCategory(){
    //se a ação for edit
    if(this.currentAction === "edit"){
      //pegar parametro id na rota e fazer request na api para trazer a categoria
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      ).subscribe(
        (category)=>{
          this.category = category;
          // Bind nos campos que vieram da api para o form
          this.categoryForm.patchValue(this.category)
        },
        (error) => alert("Ocorreu um erro. Tente novamente mais tarde!")
      )
    }
  }

  private setPageTitle(){
    if(this.currentAction === 'new')
      return this.pageTitle = 'Cadastrar categoria';

    return this.pageTitle = 'Editar categoria';
  }

  private createCategory(){
    //Object.assing cria uma categoria nova e faz o bind com o form
    const category: Category = Object.assign(new Category, this.categoryForm.value);
    this.categoryService.create(category)
    .subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionForError(error)
    )
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category, this.categoryForm.value);
    this.categoryService.update(category)
    .subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionForError(error)
    );
  }

  private actionsForSuccess(category){
    toastr.success("Ação realizada com sucesso!");
    // skipLocationChange quando true não armazena no histórico do navegador
    // then aguarda o método ser resolvido
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      ()=> this.router.navigate(["categories", category.id, "edit"])
    );
  }

  private actionForError(error){
    toastr.error("Ocorreu um erro. Tente novamente mais tarde!");
    this.submittingForm = false;
  }
}
