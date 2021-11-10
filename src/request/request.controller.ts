import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto';
import { RequestsRO, RequestRO } from './request.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('requests')
@Controller('requests')
export class RequestController {

  constructor(private readonly requestService: RequestService) {}

  @ApiOperation({ summary: 'Get all requests' })
  @ApiResponse({ status: 200, description: 'Return all requests.'})
  @Get()
  async findAll(@Query() query): Promise<RequestsRO> {
    return await this.requestService.findAll(query);
  }


  @ApiOperation({ summary: 'Get request feed' })
  @ApiResponse({ status: 200, description: 'Return request feed.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  async getFeed(@User('id') userId: number, @Query() query): Promise<RequestsRO> {
    return await this.requestService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<RequestRO> {
    return await this.requestService.findOne({slug});
  }

  @ApiOperation({ summary: 'Create request' })
  @ApiResponse({ status: 201, description: 'The request has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('request') requestData: CreateRequestDto) {
    return this.requestService.create(userId, requestData);
  }

  @ApiOperation({ summary: 'Update request' })
  @ApiResponse({ status: 201, description: 'The request has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('request') requestData: CreateRequestDto) {
    // Todo: update slug also when title gets changed
    return this.requestService.update(params.slug, requestData);
  }

  @ApiOperation({ summary: 'Delete request' })
  @ApiResponse({ status: 201, description: 'The request has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.requestService.delete(params.slug);
  }

  // @ApiOperation({ summary: 'Favorite request' })
  // @ApiResponse({ status: 201, description: 'The request has been successfully favorited.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Post(':slug/favorite')
  // async favorite(@User('id') userId: number, @Param('slug') slug) {
  //   return await this.requestService.favorite(userId, slug);
  // }

  // @ApiOperation({ summary: 'Unfavorite request' })
  // @ApiResponse({ status: 201, description: 'The request has been successfully unfavorited.'})
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Delete(':slug/favorite')
  // async unFavorite(@User('id') userId: number, @Param('slug') slug) {
  //   return await this.requestService.unFavorite(userId, slug);
  // }

}
