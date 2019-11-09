import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LivefeedListItem } from './livefeed-list.model';

export interface LivefeedListState extends EntityState<LivefeedListItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'livefeed-list' })
export class LivefeedListStore extends EntityStore<LivefeedListState, LivefeedListItem> {

  constructor() {
    super();
  }

}

