import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { updatePositionDto } from './dtos/updatePosition.dto';

describe('PositionsController', () => {
  let controller: PositionsController;

  const mockPositionService = {
    getAllPositions: jest.fn(),
    getPositionById: jest.fn(),
    createPosition: jest.fn(),
    updatePosition: jest.fn(),
    deletePosition: jest.fn(),
    getPositionHierarchy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [PositionsService]
    }).overrideProvider(PositionsService).useValue(mockPositionService).compile();

    controller = module.get<PositionsController>(PositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('it should get All Positions', () => {
    //arrange 
    const position = { id: 2, name: 'test', description:"description", parent_id: 1}

    jest.spyOn(mockPositionService, 'getAllPositions').mockReturnValue([position])
    //act
    const result = controller.getAllPositions()
    //assert
    expect(mockPositionService.getAllPositions).toHaveBeenCalled()
    expect(result).toEqual([position])
  });

  it('it should update position',async () => {
    //arrange
    const position = { id: 2, name: 'test', description:"description", parent_id: 1} as updatePositionDto

    jest.spyOn(mockPositionService, 'updatePosition').mockReturnValue(position)

    //act
    const result =  await controller.updatePosition(2, position)

    //assert
    expect(mockPositionService.updatePosition).toHaveBeenCalledWith(2, position)
    expect(result).toEqual(result);
  })
});
