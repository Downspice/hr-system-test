export interface GenericObject {
  id:string ;
  name: string;
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiResponse<T> {
  length: number;
  data: T[];
  message: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface CategoryProps {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  parentId?: string;
  parentName?: string;
}

export interface SetupMainProps {
  categoryItems: CategoryProps[];
  isError?: boolean;
  isLoading?: boolean;
  setupType?: string;
}



export interface PaginatedResponse<T> {
  message: string;
  statusCode: number;
  data: {
    content: T[];
    size: number;
    page: number;
    totalElements: number;
    totalPages: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  dateTime: string;
}
export type Role = 'Admin' | 'HR' | 'Employee';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department?: {
    id: string;
    name: string;
  } | null;
  departmentRole?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  manager?: User;
}

export interface DepartmentRole {
  id: string;
  name: string;
  description?: string;
  departmentId: string;
}

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Leave {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "firstName" | "lastName" | "email">;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "firstName" | "lastName" | "email">;
  date: string;
  checkIn: string;
  checkOut: string | null;
  totalHours: number | null;
  createdAt: string;
  updatedAt: string;
}
