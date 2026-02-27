import { Module } from '@nestjs/common';

import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  imports: [DrizzleModule],
})
export class MenuItemsModule {}
