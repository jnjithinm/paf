const endPoints = {
  AUTHENTICATE_USER: `PAF/authenticate`,
  LOGIN_USER: `PAF/login`,
  GET_INDICATORS_BY_DOMAIN_ID: `PAF/rubrics/indicatorsByDomainId/`,
  GET_DASHBOARD_DETAILS_OBSERVATION: 'PAF/teachers/observation/dashBoard/',
  GET_ALL_USERS: `PAF/users/all`,
  GET_USER: `PAF/users/`,
  GET_ALL_USER_GROUPS: `PAF/userGroups/all`,
  GET_USER_GROUPS: `PAF/userGroups/`,
  GET_ALL_DOMAINS: `PAF/metadata/domains`,
  GET_DOMAINS_BY_ID: `PAF/rubrics/indicatorsByDomainId/`,
  SAVE_EVIDENCE_CARD: `PAF/teachers/saveEvidence`,
  GET_OBSERVATION_BY_ID: `PAF/teachers/observation/`,
  GET_ALL_OBSERVATIONS: `PAF/teachers/observation/getAllObservation/`,
  GET_EVIDENCE_BY_ID: `PAF/teachers/evidence/`,
  GET_ALL_RUBRICS: `PAF/rubrics/all`,
  DELETE_RUBRIC: `PAF/rubrics`,
  GET_RUBRIC: `PAF/rubrics/`,
  GET_ALL_FLOWS: `PAF/flows/all?loggedInUserName=`,
  GET_FLOW_BY_ID: `PAF/flows/`,
  GET_FORM_BY_ID: `PAF/forms/`,
  GET_PREVIEW_FORM:`PAF/forms/previewForm/`
};
export default endPoints;
