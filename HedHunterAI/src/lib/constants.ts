export const COLORS = {
  bg:"#ffffff",bg2:"#0a1326",surface:"#f5f7fa",surface2:"#e8edf5",
  border:"rgba(0,0,0,.07)",border2:"rgba(0,0,0,.11)",
  ink:"#0f172a",dim:"#475569",muted:"#64748b",muted2:"#94a3b8",
  accent:"#5b8def",cyan:"#3ce8ff",warn:"#0f172a",good:"#3ddc97",danger:"#ff5e5e",
} as const;
export const PRICING={SEEKER_ANNUAL_CENTS:1000,SEEKER_OFFER_CENTS:2000,COMPANY_ANNUAL_CENTS:10000,COMPANY_PER_POSITION_CENTS:5000} as const;
export const LIMITS={MAX_INTERVIEW_QUESTIONS:20,DEFAULT_TIME_LIMIT_SEC:120,MAX_SCORE_PER_QUESTION:5,MIN_AI_CONFIDENCE:0.8,MAX_FILE_SIZE_MB:10,ALLOWED_FILE_TYPES:[".pdf",".docx"]} as const;
export const ANONYMIZATION_VECTORS=["first_name","last_name","full_name","pronouns","age","date_of_birth","race_ethnicity","gender_markers","photo","street_address","zip_code","school_name","gendered_activity","personal_reference"] as const;
export const PROTECTED_TOPICS=["age","race","gender","religion","marital_status","pregnancy","disability","sexual_orientation","nationality","medical_condition","family_status"] as const;
export const ROUTES={HOME:"/",LOGIN:"/login",SIGNUP_SEEKER:"/signup/job-seeker",SIGNUP_COMPANY:"/signup/company",JS_DASHBOARD:"/job-seeker/dashboard",JS_ONBOARDING:"/job-seeker/onboarding",JS_PAYMENT:"/job-seeker/payment",JS_RESUME:"/job-seeker/resume-upload",JS_COVER:"/job-seeker/cover-letter-upload",JS_PREVIEW:"/job-seeker/anonymized-preview",JS_JOBS:"/job-seeker/jobs",JS_APPLICATIONS:"/job-seeker/applications",JS_OFFERS:"/job-seeker/offers",CO_DASHBOARD:"/company/dashboard",CO_ONBOARDING:"/company/onboarding",CO_PAYMENT:"/company/payment",CO_PROFILE:"/company/profile",CO_JOBS:"/company/jobs",CO_CREATE_JOB:"/company/jobs/create",CO_RATINGS:"/company/ratings",AD_DASHBOARD:"/admin/dashboard",AD_USERS:"/admin/users",AD_COMPANIES:"/admin/companies",AD_JOBS:"/admin/jobs",AD_PAYMENTS:"/admin/payments",AD_ANON_REVIEW:"/admin/anonymization-review",AD_FLAGS:"/admin/flagged-questions",AD_APPEALS:"/admin/appeals",AD_AUDIT:"/admin/audit-logs",AD_SETTINGS:"/admin/settings"} as const;
export const STATUS_COLORS:Record<string,{bg:string;text:string;border:string}>={
  DRAFT:{bg:"rgba(126,138,163,.12)",text:"#64748b",border:"rgba(126,138,163,.3)"},
  SUBMITTED:{bg:"rgba(91,141,239,.12)",text:"#5b8def",border:"rgba(91,141,239,.3)"},
  REVIEWING:{bg:"rgba(126,138,163,.12)",text:"#0f172a",border:"rgba(126,138,163,.3)"},
  SHORTLISTED:{bg:"rgba(60,232,255,.12)",text:"#3ce8ff",border:"rgba(60,232,255,.3)"},
  OFFER_SENT:{bg:"rgba(91,141,239,.18)",text:"#5b8def",border:"rgba(91,141,239,.4)"},
  HIRED:{bg:"rgba(61,220,151,.12)",text:"#3ddc97",border:"rgba(61,220,151,.3)"},
  REJECTED:{bg:"rgba(255,94,94,.12)",text:"#ff5e5e",border:"rgba(255,94,94,.3)"},
  APPEALING:{bg:"rgba(126,138,163,.18)",text:"#0f172a",border:"rgba(126,138,163,.4)"},
  PENDING:{bg:"rgba(126,138,163,.12)",text:"#0f172a",border:"rgba(126,138,163,.3)"},
  APPROVED:{bg:"rgba(61,220,151,.12)",text:"#3ddc97",border:"rgba(61,220,151,.3)"},
  SUSPENDED:{bg:"rgba(255,94,94,.12)",text:"#ff5e5e",border:"rgba(255,94,94,.3)"},
  OK:{bg:"rgba(61,220,151,.09)",text:"#3ddc97",border:"rgba(61,220,151,.22)"},
  FLAG:{bg:"rgba(126,138,163,.09)",text:"#0f172a",border:"rgba(126,138,163,.2)"},
  "HUMAN HOLD":{bg:"rgba(60,232,255,.09)",text:"#3ce8ff",border:"rgba(60,232,255,.22)"},
};
