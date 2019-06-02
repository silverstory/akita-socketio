import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShoppingListStore, ShoppingListState } from './shopping-list.store';
import { ShoppingListItem } from './shopping-list.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListQuery extends QueryEntity<ShoppingListState, ShoppingListItem> {

  constructor(protected store: ShoppingListStore) {
    super(store);
  }

}
