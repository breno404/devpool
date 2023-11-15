/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCourseService } from '../services/createCourse.service';
import { createProjectService } from '../services/createProject.service';
import { createUserService } from '../services/createUser.service';
import { deleteCourseUserService } from '../services/deleteCourseUser.service';
import { deleteProjectUserService } from '../services/deleteProjectUser.service';
import { deleteUserService } from '../services/deleteUser.service';
import { getAllTechnologies } from '../services/getAllTechnologies.service';
import { getAllUsersService } from '../services/getAllUsers.service';
import { getCoursesByUserService } from '../services/getCoursesByUser.service';
import { getProjectsByUser } from '../services/getProjectsByUser.service';
import { getRolesService } from '../services/getRoles.service';
import { getUserByEmail } from '../services/getUserByEmail.service';
import { updateUserService } from '../services/updateUser.service';
import { ICreateCourseInput, IDeleteCourseInput } from '../types/CousersTypes';
import { ICreateProjectInput, IDeleteProjectInput, IGetProjectsByUserInput } from '../types/ProjectTypes';
import {
  IDeleteUserInput, IGetUserByEmailInput, IUpdateUserInput, IcreateUserInput,
} from '../types/UsersTypes';

export const resolvers = {

  Query: {
    getAllUsers: async () => getAllUsersService(),
    getUserByEmail: async (_:any, args: IGetUserByEmailInput) => getUserByEmail(args.input.email),
    getRoles: async () => getRolesService(),
    getTechnologies: async () => getAllTechnologies(),
    getProjectsByUser: async (
      _:any,
      args: IGetProjectsByUserInput,
    ) => getProjectsByUser(args.input.userId),
    getCoursesByUser: async (
      _:any,
      args: IGetProjectsByUserInput,
    ) => getCoursesByUserService(args.input.userId),

  },

  Mutation: {
    createUser: async (_:any, args: IcreateUserInput) => createUserService(args.input),
    createProject: async (_:any, args:ICreateProjectInput) => createProjectService(args.input),
    updateUser: async (_:any, args:IUpdateUserInput) => updateUserService(args.input),
    deleteProjectUser: async (
      _:any,
      args:IDeleteProjectInput,
    ) => deleteProjectUserService(args.input),
    deleteUser: async (_:any, args: IDeleteUserInput) => deleteUserService(args.input.userId),
    createCourse: async (_:any, args: ICreateCourseInput) => createCourseService(args.input),
    deleteCourseUser: async (
      _:any,
      args: IDeleteCourseInput,
    ) => deleteCourseUserService(args.input),
  },

};
