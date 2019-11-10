import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { LivefeedListStore } from './state/livefeed-list.store';
import { ID, runStoreAction, StoreActions } from '@datorama/akita';
import { createLivefeedListItem } from './state/livefeed-list.model';

const resolveAction = {
  ADD: StoreActions.AddEntities,
  REMOVE: StoreActions.RemoveEntities,
  SET: StoreActions.SetEntities,
  UPDATE: StoreActions.UpdateEntities
};

@Injectable({ providedIn: 'root' })
export class LivefeedListService {
  private socket;

  constructor(private store: LivefeedListStore) {
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

  feed(name: string) {
    this.socket.emit('list:feed', createLivefeedListItem({ name }));
  }

  add(name: string) {
    this.socket.emit('list:add', createLivefeedListItem({ name }));
  }

  remove(id: ID) {
    this.socket.emit('list:remove', id);
  }

  toggleCompleted(id: ID) {
    this.socket.emit('list:toggle', id);
  }
}
