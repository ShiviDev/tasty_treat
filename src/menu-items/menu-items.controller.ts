import { Body, Controller, Get, Post } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemDto } from './dtos/menu-item.dto';

@Controller('menu')
export class MenuItemsController {
  constructor(private readonly menuItemService: MenuItemsService) {}

  @Post('/addItems')
  addMenuItems(@Body() body: { items: MenuItemDto[] }) {
    return this.menuItemService.createItem(body.items);
  }

  @Get('/')
  getMenu() {
    return this.menuItemService.getMenu();
  }
}
