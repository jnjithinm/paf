//Role Levels
export const ROLE_LEVEL_PAF_CENTRAL_OFFICE = 'PAF Central Office';
export const ROLE_LEVEL_DISTRICT = 'District';
export const ROLE_LEVEL_AREA = 'Area';
export const ROLE_LEVEL_SCHOOL = 'School';
export const ROLE_LEVEL_CLASS = 'Class';

//Parent Roles

//PAF Central Office Level
export const PARENT_ROLE_ADMIN = 'Admin';
export const PARENT_ROLE_LEAD = 'Lead';
export const PARENT_ROLE_CURRICULUM_MANAGER = 'Curriculum Manager';
export const PARENT_ROLE_CURRICULUM_DEVELOPER = 'Curriculum Developer';
export const PARENT_ROLE_PROGRAM_HEAD = 'Program Head';
export const PARENT_ROLE_QUALITY_ASSURANCE_MANAGER =
  'Quality Assurance Manager';
export const PARENT_ROLE_PROJECT_HEAD = 'Project Head';

//District Level
export const PARENT_ROLE_DISTRICT_MANAGER = 'District Manager';
export const PARENT_ROLE_DISTRICT_EDUCATION_MANAGER =
  'District Education Officer';

//Area Level
export const PARENT_ROLE_AREA_MANAGER = 'Area Manager';
export const PARENT_ROLE_PROGRAM_MANAGER = 'Program Manager';
export const PARENT_ROLE_FACILITATOR = 'Facilitator';

//School Level
export const PARENT_ROLE_PRINCIPAL = 'Principal';
export const PARENT_ROLE_HEAD_MISTRESS = 'Head Mistress';
export const PARENT_ROLE_HEAD_MASTER = 'Head Master';
export const PARENT_ROLE_SUPERVISOR = 'Supervisor';
export const PARENT_ROLE_TEACHER = 'Teacher';

//Class Level
export const PARENT_ROLE_STUDENT = 'Student';

//User Types
export const USER_TYPE_PAF_USER = 'PAF User';
export const USER_TYPE_REGISTERED_USER = 'Registered User';

//Role Level-Structure
export const roleLevels = [
  {
    level: ROLE_LEVEL_PAF_CENTRAL_OFFICE,
    userType: USER_TYPE_PAF_USER,
    roles: [
      PARENT_ROLE_ADMIN,
      PARENT_ROLE_LEAD,
      PARENT_ROLE_CURRICULUM_MANAGER,
      PARENT_ROLE_CURRICULUM_DEVELOPER,
      PARENT_ROLE_PROGRAM_HEAD,
      PARENT_ROLE_QUALITY_ASSURANCE_MANAGER,
      PARENT_ROLE_PROJECT_HEAD,
    ],
  },
  {
    level: ROLE_LEVEL_DISTRICT,
    userType: USER_TYPE_PAF_USER,
    roles: [
      PARENT_ROLE_DISTRICT_MANAGER,
      PARENT_ROLE_DISTRICT_EDUCATION_MANAGER,
    ],
  },
  {
    level: ROLE_LEVEL_AREA,
    userType: USER_TYPE_PAF_USER,
    roles: [
      PARENT_ROLE_AREA_MANAGER,
      PARENT_ROLE_PROGRAM_MANAGER,
      PARENT_ROLE_FACILITATOR,
    ],
  },
  {
    level: ROLE_LEVEL_SCHOOL,
    userType: USER_TYPE_REGISTERED_USER,
    roles: [
      PARENT_ROLE_PRINCIPAL,
      PARENT_ROLE_HEAD_MISTRESS,
      PARENT_ROLE_HEAD_MASTER,
      PARENT_ROLE_SUPERVISOR,
      PARENT_ROLE_TEACHER,
    ],
  },
  {
    level: ROLE_LEVEL_CLASS,
    userType: USER_TYPE_REGISTERED_USER,
    roles: [PARENT_ROLE_STUDENT],
  },
] as const;

// Extracting all roles, levels & userTypes
export const allRoles = roleLevels.flatMap(roleLevel => roleLevel.roles);
export const allLevels = roleLevels.map(roleLevel => roleLevel.level);
export const allUserTypes = roleLevels.map(roleLevel => roleLevel.userType);
