import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import * as schema from './schema';
import * as categorySchema from '../category/schema';
import { MenuItemDto } from './dtos/menu-item.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class MenuItemsService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createItem(items: MenuItemDto[]) {
    for (let i = 0; i < items.length; i++) {
      let { name, image, price, course, classification } = items[i];
      let result = await this.database.transaction(async (tx) => {
        const [itemResult] = await tx
          .insert(schema.menuItemsTable)
          .values({ name, image, price, course, classification })
          .returning();

        let category = items[i].category;
        for (let j = 0; j < category.length; j++) {
          await tx
            .insert(categorySchema.categoryTable)
            .values({ menuItemId: itemResult.id, category: category[j] });
        }
      });
    }
  }

  async getMenu() {
    const rows = await this.database
      .select()
      .from(schema.menuItemsTable)
      .leftJoin(
        categorySchema.categoryTable,
        eq(schema.menuItemsTable.id, categorySchema.categoryTable.menuItemId),
      );
    const resultMap = new Map();

    for (const row of rows) {
      const item = row.menuItems;
      const category = row.categories?.category;

      if (!resultMap.has(item.id)) {
        resultMap.set(item.id, {
          id: item.id,
          name: item.name,
          image: item.image,
          price: Number(item.price),
          qty: 1,
          category: [],
          classification: item.classification,
          course: item.course,
        });
      }

      if (category) {
        resultMap.get(item.id).category.push(category);
      }
    }

    return { items: Array.from(resultMap.values()) };
  }
}
