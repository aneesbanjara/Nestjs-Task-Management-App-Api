import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterTaskDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterTaskDto;
    const query = this.createQueryBuilder('task');
    console.log(user);
    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title Like :search OR task.description Like :search)',
        { search: `%${search}%` },
      );
    }
    const Tasks = await query.getMany();
    return Tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.userId = user.id;
    await task.save();
    return task;
  }
}
