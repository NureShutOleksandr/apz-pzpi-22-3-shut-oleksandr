import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Role, RoleDocument } from './roles.schema'
import { isValidObjectId, Model } from 'mongoose'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { User, UserDocument } from '../users/users.schema'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Retrieves a role by its value from the database
  async getRoleByValue(value: string): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ value }).exec()

    if (!role) throw new HttpException('Role not found by this name or has not been initialized', HttpStatus.NOT_FOUND)

    return role
  }

  // Fetches all roles from the database
  async getRoles(): Promise<RoleDocument[]> {
    return this.roleModel.find().exec()
  }

  // Creates a new role if it doesn't already exist
  async createRole(dto: CreateRoleDto): Promise<RoleDocument> {
    const isExist = await this.roleModel.exists({ value: dto.value })

    if (isExist) throw new HttpException('Role already exist', HttpStatus.BAD_REQUEST)

    const role = new this.roleModel(dto)
    return role.save()
  }

  // Updates an existing role's value and description
  async updateRole(dto: UpdateRoleDto): Promise<RoleDocument> {
    if (!isValidObjectId(dto.id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST)
    }

    const role = await this.roleModel.findById(dto.id).exec()

    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND)
    }

    dto.value = dto.value.toUpperCase()

    const isExist = await this.roleModel.exists({ value: dto.value })

    if (isExist) throw new HttpException('Role already exist', HttpStatus.BAD_REQUEST)

    const updatedRole = await this.roleModel
      .findByIdAndUpdate(dto.id, { value: dto.value, description: dto.description }, { new: true })
      .exec()

    return updatedRole
  }

  // Assigns a role to a user by updating their role ID
  async updateUserRole(dto: UpdateUserRoleDto): Promise<UserDocument> {
    if (!isValidObjectId(dto.user_id)) {
      throw new HttpException('Invalid user ID format', HttpStatus.BAD_REQUEST)
    }

    const user = await this.userModel.findById(dto.user_id)
    if (!user) {
      throw new HttpException('User with the specified ID does not exist', HttpStatus.NOT_FOUND)
    }

    const role = await this.getRoleByValue(dto.role_name)
    if (!role) {
      throw new HttpException('Specified role not found', HttpStatus.NOT_FOUND)
    }

    user.roles = [role._id]
    await user.save()

    return user.populate('roles')
  }

  // Deletes a role if it exists and is not assigned to any users
  async deleteRole(id: string): Promise<RoleDocument> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST)
    }

    const role = await this.roleModel.findById(id).exec()

    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND)
    }

    const users = await this.userModel.find({ roles: { $in: [role._id] } }).exec()

    if (users.length) {
      throw new HttpException('Role is used by users', HttpStatus.BAD_REQUEST)
    }

    const deletedRole = await this.roleModel.findByIdAndDelete(id).exec()

    return deletedRole
  }
}
