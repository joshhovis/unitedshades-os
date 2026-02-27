import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { createVehicleSchema } from './dto/create-vehicle.dto';
import { updateVehicleSchema } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = createVehicleSchema.parse(body);
    return this.vehiclesService.create(parsed);
  }

  @Get()
  findAll(@Query('customerId') customerId?: string) {
    return this.vehiclesService.findAll(customerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = updateVehicleSchema.parse(body);
    return this.vehiclesService.update(id, parsed);
  }
}
