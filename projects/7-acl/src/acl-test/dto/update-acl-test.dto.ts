import { PartialType } from '@nestjs/mapped-types'
import { CreateAclTestDto } from './create-acl-test.dto'

export class UpdateAclTestDto extends PartialType(CreateAclTestDto) {}
