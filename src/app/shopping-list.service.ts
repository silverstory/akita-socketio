import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { ShoppingListStore } from './state/shopping-list.store';
import { ID, runStoreAction, StoreActions } from '@datorama/akita';
import { createShoppingListItem } from './state/shopping-list.model';

const resolveAction = {
  ADD: StoreActions.AddEntities,
  REMOVE: StoreActions.RemoveEntities,
  SET: StoreActions.SetEntities,
  UPDATE: StoreActions.UpdateEntities
};

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private socket;

  constructor(private store: ShoppingListStore) {
  }

  connect() {
    this.socket = io.connect('http://localhost:8000');

    this.socket.on('list', event => {
      runStoreAction(this.store.storeName, resolveAction[event.type], {
        payload: {
          entityIds: event.ids,
          data: event.data
        }
      });
    });

    return () => this.socket.disconnect();
  }

  add(title: string) {
    this.socket.emit('list:add', createShoppingListItem({ title }));
  }

  remove(id: ID) {
    this.socket.emit('list:remove', id);
  }

  toggleCompleted(id: ID) {
    this.socket.emit('list:toggle', id);
  }
}
