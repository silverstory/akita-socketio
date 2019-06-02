import { guid, ID } from '@datorama/akita';

export interface ShoppingListItem {
  id: ID;
  title: string;
  completed: boolean;
}

export function createShoppingListItem({ title }: Partial<ShoppingListItem>) {
  return {
    id: guid(),
    title,
    completed: false,
  } as ShoppingListItem;
}
