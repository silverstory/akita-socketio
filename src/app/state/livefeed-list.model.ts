import { guid, ID } from '@datorama/akita';

export interface LivefeedListItem {
  id: ID;
  // title: string;
  profileid: string;
  name: string;
  gender: string;
  imagepath: string;
  distinction: string;
  gate: string;
  completed: boolean;
}

export function createLivefeedListItem({ name }: Partial<LivefeedListItem>) {
  return {
    id: guid(),
    profileid: '0041955',
    // tslint:disable-next-line: object-literal-shorthand
    name: name,
    gender: 'male',
    imagepath: 'http://testpath.com/img.jpg',
    distinction: 'OPEMPLOYEE',
    gate: 'GATE7',
    completed: false,
  } as LivefeedListItem;
}
