import { Body, Controller, Delete, Get, Param, ParseBoolPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { createPositionDto } from './dtos/createPosition.dto';
import { updatePositionDto } from './dtos/updatePosition.dto';
import { PositionsService } from './positions.service';

@Controller('api/positions')
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
    updatePosition(@Param('id') id: number, @Body() body: updatePositionDto) {
        return this.positionsService.updatePosition(id, body);
    }

    @Delete(':id')
    deletePosition(@Param('id') id: number, @Query('deleteChildren', ParseBoolPipe) deleteChildren: boolean) {
        return this.positionsService.deletePosition(id, deleteChildren);
    }

    @Get('hierarchy/:id')
    getPositionHierarchy(@Param('id') id: number) {
        return this.positionsService.getPositionHierarchy(id);
    }
}
