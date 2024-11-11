import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionEntity } from '../../src/entities/positions.entity';
import { NotFoundException } from '@nestjs/common';

describe('PositionsService', () => {
  let service: PositionsService;

  const mockPositionRepository = {
    find: jest.fn(),
    findOne: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionsService,
        {
          provide: getRepositoryToken(PositionEntity),
          useValue: mockPositionRepository
        }
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllPostions => should throw not found error', async () => {
    //arrange
    jest.spyOn(mockPositionRepository, 'findOne').mockResolvedValue(null);
    //act

    //assert
    await expect(service.getAllPositions()).rejects.toThrow(NotFoundException)
    expect(mockPositionRepository.findOne).toHaveBeenCalled();
  })

  it('getAllPostions =>', async() => {
    //arrange
    const mockRootPosition = {
      id: 1,
      name: 'CEO',
      parent_id: null,
      children: [
        {
          id: 2,
          name: 'Child Position',
          parent_id: 1,
          children: []
        },
      ],
    };

    const mockChildPosition = [
        {
          id: 2,
          name: 'Child Position',
          parent_id: 1,
          children: []
        }
      
      ];
    
    jest.spyOn(mockPositionRepository, 'findOne').mockResolvedValue(mockRootPosition);
    jest.spyOn(mockPositionRepository, 'find').mockResolvedValue(mockChildPosition);
    //act
  
    //assert
   await  expect(service.getAllPositions()).resolves.toBe(mockChildPosition)
    // expect(mockPositionRepository.findOne).toHaveBeenCalledWith({
    //   where: { id: 1 },
    //   relations: ['children'],
    //   select: {
    //     id: true,
    //     name: true,
    //     parent_id: true,
    //   },
    // });

   
  
    // expect(mockPositionRepository.find).toHaveBeenCalled();

  })


});
