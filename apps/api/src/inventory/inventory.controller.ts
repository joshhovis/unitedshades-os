/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { createInventoryItemSchema } from './dto/create-item.dto';
import { adjustStockSchema } from './dto/adjust-stock.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Post('items')
  createItem(@Body() body: unknown) {
    const parsed = createInventoryItemSchema.parse(body);
    return this.service.createItem(parsed);
  }

  @Get('items')
  listItems() {
    return this.service.listItems();
  }

  @Get('items/one')
  getItem(@Query('id') id?: string) {
    if (!id) return null;
    return this.service.getItem(id);
  }

  @Post('adjust')
  adjust(@Body() body: unknown) {
    const parsed = adjustStockSchema.parse(body);
    return this.service.adjustStock(parsed);
  }

  @Get('movements')
  listMovements(@Query('itemId') itemId?: string) {
    return this.service.listMovements(itemId);
  }
}
