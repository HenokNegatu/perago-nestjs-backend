import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { createPositionDto } from './dtos/createPosition.dto';
import { updatePositionDto } from './dtos/updatePosition.dto';

@Controller('positions')
export class PositionsController {
    @Get()
    getAllPositions() {
        return [{'id': '1', 'name': 'CEO', 'description': 'CEO of the company', 'parent_id': null}, {'id': '2', 'name': 'CTO', 'description': 'CTO of the company', 'parent_id': null}];
    }

    @Get(':id')
    getPositionById(@Param('id') id: string) {
        return [{'id': id, 'name': 'CEO', 'description': 'CEO of the company', 'parent_id': null}];
    }

    @Post()
    createPosition(@Body() body: createPositionDto) {
        return `Hello World ${body}`;
    }

    @Put(':id')
    updatePosition(@Param('id') id: string, @Body() body: updatePositionDto) {
        return `Hello World ${id} ${body}`;
    }

    @Delete(':id')
    deletePosition(@Param('id') id: string) {
        return `Hello World ${id}`;
    }
}
