import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import {
  createCustomerSchema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CreateCustomerDto,
} from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() body: unknown) {
    const parsed = createCustomerSchema.parse(body);
    return this.customersService.create(parsed);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.customersService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }
}
