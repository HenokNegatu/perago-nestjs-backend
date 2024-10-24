import { Body, Controller, Delete, Get, Param, ParseBoolPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { createPositionDto } from './dtos/createPosition.dto';
import { updatePositionDto } from './dtos/updatePosition.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {

    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    getAllPositions() {
        return this.positionsService.getAllPositions();
    }

    @Get(':id')
    getPositionById(@Param('id') id: string) {
        return this.positionsService.getPositionById(parseInt(id));
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createPosition(@Body() body: createPositionDto) {
        return this.positionsService.createPosition(body);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updatePosition(@Param('id') id: string, @Body() body: updatePositionDto) {
        return this.positionsService.updatePosition(parseInt(id), body);
    }

    @Delete(':id')
    deletePosition(@Param('id') id: string, @Query('deleteChildren', ParseBoolPipe) deleteChildren: boolean) {
        return this.positionsService.deletePosition(parseInt(id), deleteChildren);
    }
}