// Enums for Role Levels
export enum RoleLevelTypes {
  PAF_CENTRAL_OFFICE = 'PAF Central Office',
  DISTRICT = 'District',
  AREA = 'Area',
  SCHOOL = 'School',
  CLASS = 'Class',
}

// Enums for User Types
export enum UserTypes {
  PAF_USER = 'PAF User',
  REGISTERED_USER = 'Registered User',
}

// Enums for Parent Roles
export enum ParentRoles {
  ADMIN = 'Admin',
  LEAD = 'Lead',
  CURRICULUM_MANAGER = 'Curriculum Manager',
  CURRICULUM_DEVELOPER = 'Curriculum Developer',
  PROGRAM_HEAD = 'Program Head',
  QUALITY_ASSURANCE_MANAGER = 'Quality Assurance Manager',
  PROJECT_HEAD = 'Project Head',
  DISTRICT_MANAGER = 'District Manager',
  DISTRICT_EDUCATION_MANAGER = 'District Education Officer',
  AREA_MANAGER = 'Area Manager',
  PROGRAM_MANAGER = 'Program Manager',
  FACILITATOR = 'Facilitator',
  PRINCIPAL = 'Principal',
  HEAD_MISTRESS = 'Head Mistress',
  HEAD_MASTER = 'Head Master',
  SUPERVISOR = 'Supervisor',
  TEACHER = 'Teacher',
  STUDENT = 'Student',
}

// Role Level Structure Type
export interface RoleLevelMapping {
  level: RoleLevelTypes;
  userType: UserTypes;
  roles: ParentRoles[];
}

// Role Levels
export const roleLevels: RoleLevelMapping[] = [
  {
    level: RoleLevelTypes.PAF_CENTRAL_OFFICE,
    userType: UserTypes.PAF_USER,
    roles: [
    ParentRoles.ADMIN,
      ParentRoles.LEAD,
      ParentRoles.CURRICULUM_MANAGER,
      ParentRoles.CURRICULUM_DEVELOPER,
      ParentRoles.PROGRAM_HEAD,
      ParentRoles.QUALITY_ASSURANCE_MANAGER,
      ParentRoles.PROJECT_HEAD,
    ],
  },
  {
    level: RoleLevelTypes.DISTRICT,
    userType: UserTypes.PAF_USER,
    roles: [
      ParentRoles.DISTRICT_MANAGER,
      ParentRoles.DISTRICT_EDUCATION_MANAGER,
    ],
  },
  {
    level: RoleLevelTypes.AREA,
    userType: UserTypes.PAF_USER,
    roles: [
      ParentRoles.AREA_MANAGER,
      ParentRoles.PROGRAM_MANAGER,
      ParentRoles.FACILITATOR,
    ],
  },
  {
    level: RoleLevelTypes.SCHOOL,
    userType: UserTypes.REGISTERED_USER,
    roles: [
      ParentRoles.PRINCIPAL,
      ParentRoles.HEAD_MISTRESS,
      ParentRoles.HEAD_MASTER,
      ParentRoles.SUPERVISOR,
      ParentRoles.TEACHER,
    ],
  },
  {
    level: RoleLevelTypes.CLASS,
    userType: UserTypes.REGISTERED_USER,
    roles: [ParentRoles.STUDENT],
  },
];

