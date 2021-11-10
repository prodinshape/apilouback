import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto';
import { CollectionsRO, CollectionRO } from './collection.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('collections')
@Controller('collections')
export class CollectionController {

  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({ status: 200, description: 'Return all collections.'})
  @Get()
  async findAll(@Query() query): Promise<CollectionsRO> {
    return await this.collectionService.findAll(query);
  }


  @ApiOperation({ summary: 'Get collection feed' })
  @ApiResponse({ status: 200, description: 'Return collection feed.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  async getFeed(@User('id') userId: number, @Query() query): Promise<CollectionsRO> {
    return await this.collectionService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<CollectionRO> {
    return await this.collectionService.findOne({slug});
  }

  @ApiOperation({ summary: 'Create collection' })
  @ApiResponse({ status: 201, description: 'The collection has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('collection') collectionData: CreateCollectionDto) {
    return this.collectionService.create(userId, collectionData);
  }

  @ApiOperation({ summary: 'Update collection' })
  @ApiResponse({ status: 201, description: 'The collection has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('collection') collectionData: CreateCollectionDto) {
    // Todo: update slug also when title gets changed
    return this.collectionService.update(params.slug, collectionData);
  }

  @ApiOperation({ summary: 'Delete collection' })
  @ApiResponse({ status: 201, description: 'The collection has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.collectionService.delete(params.slug);
  }

  // @ApiOperation({ summary: 'Favorite collection' })
  // @ApiResponse({ status: 201, description: 'The collection has been successfully favorited.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Post(':slug/favorite')
  // async favorite(@User('id') userId: number, @Param('slug') slug) {
  //   return await this.collectionService.favorite(userId, slug);
  // }

  // @ApiOperation({ summary: 'Unfavorite collection' })
  // @ApiResponse({ status: 201, description: 'The collection has been successfully unfavorited.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Delete(':slug/favorite')
  // async unFavorite(@User('id') userId: number, @Param('slug') slug) {
  //   return await this.collectionService.unFavorite(userId, slug);
  // }

}
