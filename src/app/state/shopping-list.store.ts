import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ShoppingListItem } from './shopping-list.model';

export interface ShoppingListState extends EntityState<ShoppingListItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shopping-list' })
export class ShoppingListStore extends EntityStore<ShoppingListState, ShoppingListItem> {

  constructor() {
    super();
  }

}

