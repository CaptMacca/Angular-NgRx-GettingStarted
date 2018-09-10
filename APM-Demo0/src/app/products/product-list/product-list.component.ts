import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';

// Import the products state from the reducer and action
import * as fromProduct from '../state/product.reducer';
import * as productActions from '../state/product.actions';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage$: Observable<string>;
  componentActive = true;

  displayCode: boolean;

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  products$: Observable<Product[]>;

  // Strongly type the state by pointing at the extended global state
  // in the products reducer
  constructor(private store: Store<fromProduct.State>) { }

  ngOnInit(): void {
    // TODO: Unsubscribe
    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));

    this.products$ = this.store.pipe(select(fromProduct.getProducts));

    this.store.dispatch(new productActions.Load());

    this.store.pipe(
      select(fromProduct.getCurrentProduct),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProduct => this.selectedProduct = currentProduct
    );

    this.store.pipe(select(fromProduct.getShowProductCode),
      takeWhile(() => this.componentActive)
    ).subscribe(
      showProductCode => this.displayCode = showProductCode
    );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

}
