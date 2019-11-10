import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { LivefeedListService } from './livefeed-list.service';
import { Observable } from 'rxjs';
import { LivefeedListQuery } from './state/livefeed-list.query';
import { ID } from '@datorama/akita';
import { LivefeedListItem } from './state/livefeed-list.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss']
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  items$: Observable<LivefeedListItem[]>;
  private disposeConnection: VoidFunction;

  constructor(private livefeedList: LivefeedListService, private query: LivefeedListQuery) {
  }

  ngOnInit() {
    this.items$ = this.query.selectAll();
    this.disposeConnection = this.livefeedList.connect();
  }

  feed(input: HTMLInputElement) {
    this.livefeedList.feed(input.value);
    input.value = '';
  }

  add(input: HTMLInputElement) {
    this.livefeedList.add(input.value);
    input.value = '';
  }

  remove(id: ID) {
    this.livefeedList.remove(id);
  }

  toggle(id: ID) {
    this.livefeedList.toggleCompleted(id);
  }

  track(_, item) {
    return item.name;
  }

  ngOnDestroy() {
    this.disposeConnection();
  }

}
