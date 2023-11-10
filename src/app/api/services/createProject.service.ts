import { prisma } from '../database';
import { IProjectInput } from '../types/ProjectTypes';
import { AppError } from '../utils/appError';

interface ICreateProjectInput {
  project: IProjectInput
  technologies: string[]
}

export const createProjectService = async ({ project, technologies }:ICreateProjectInput) => {
  try {
    const userExists = await prisma.user.findFirst({
      where: {
        id: project.user_id,
      },
    });
    if (!userExists) {
      throw new AppError('Usuário não existe', 404);
    }

    const projectAlreadyExists = await prisma.project.findFirst({
      where: {
        name: project.name,
      },
    });
    if (projectAlreadyExists) {
      throw new AppError('Já existe um projeto cadastrado com esse nome', 400);
    }

    const projectCreated = await prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
        image_url: project.image_url,
        repo_url: project.repo_url,
        deployed_url: project.deployed_url,
        userId: project.user_id,
      },
    });

    technologies.forEach(async (element) => {
      const projectTechnologyAlreadyExists = await prisma.projectTechnology.findFirst({
        where: {
          projectId: projectCreated.id,
          technologyId: element,
        },
      });

      if (projectTechnologyAlreadyExists) {
        throw new AppError('Tecnologia já inserida no projeto', 400);
      }

      const technologyExists = await prisma.technology.findFirst({
        where: {
          id: element,
        },
      });

      if (!technologyExists) {
        throw new AppError('Tecnologia não existe', 404);
      }

      await prisma.projectTechnology.create({
        data: {
          projectId: projectCreated.id,
          technologyId: element,
        },
      });
    });

    return {
      projectId: projectCreated.id,
      status: 'success',
      message: 'Project created successfully',
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        projectId: null,
        status: 'error',
        message: error.message,
      };
    }
    return {
      projectId: null,
      status: 'error',
      message: 'Internal server error',
    };
  }
};
