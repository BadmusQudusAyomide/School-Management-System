import { api } from '../lib/api';
import type { ApiResponse } from '../types';

type Entity = Record<string, unknown>;

const list = async (endpoint: string) => {
  const response = await api.get<ApiResponse<Entity[]>>(endpoint);
  return response.data.data ?? [];
};

export const referenceDataService = {
  listUsers: () => list('/users'),
  listStudents: () => list('/students'),
  listTeachers: () => list('/teachers'),
  listClasses: () => list('/classes'),
  listExams: () => list('/exams'),
};
