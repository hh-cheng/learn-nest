import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common'

import { LoginGuard } from 'src/login.guard'
import { PermissionGuard } from 'src/permission.guard'
import { AclTestService } from './acl-test.service'
import { CreateAclTestDto } from './dto/create-acl-test.dto'
import { UpdateAclTestDto } from './dto/update-acl-test.dto'

@Controller('acl-test')
export class AclTestController {
  constructor(private readonly aclTestService: AclTestService) {}

  @Post()
  @UseGuards(LoginGuard)
  create(@Body() createAclTestDto: CreateAclTestDto) {
    return this.aclTestService.create(createAclTestDto)
  }

  @Get()
  @UseGuards(LoginGuard, PermissionGuard)
  @SetMetadata('permission', 'query')
  findAll() {
    return this.aclTestService.findAll()
  }

  @Get(':id')
  @UseGuards(LoginGuard)
  findOne(@Param('id') id: string) {
    return this.aclTestService.findOne(+id)
  }

  @Patch(':id')
  @UseGuards(LoginGuard)
  update(@Param('id') id: string, @Body() updateAclTestDto: UpdateAclTestDto) {
    return this.aclTestService.update(+id, updateAclTestDto)
  }

  @Delete(':id')
  @UseGuards(LoginGuard)
  remove(@Param('id') id: string) {
    return this.aclTestService.remove(+id)
  }
}
