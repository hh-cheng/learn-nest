import { Injectable } from '@nestjs/common'
import { CreateAclTestDto } from './dto/create-acl-test.dto'
import { UpdateAclTestDto } from './dto/update-acl-test.dto'

@Injectable()
export class AclTestService {
  create(createAclTestDto: CreateAclTestDto) {
    return 'This action adds a new aclTest'
  }

  findAll() {
    return `This action returns all aclTest`
  }

  findOne(id: number) {
    return `This action returns a #${id} aclTest`
  }

  update(id: number, updateAclTestDto: UpdateAclTestDto) {
    return `This action updates a #${id} aclTest`
  }

  remove(id: number) {
    return `This action removes a #${id} aclTest`
  }
}
