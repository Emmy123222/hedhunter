export interface JobPost {
  id:                     string;
  companyId:              string;
  title:                  string;
  description:            string;
  requiredQualifications: string;
  preferredQualifications?: string | null;
  salaryMin?:             number | null;
  salaryMax?:             number | null;
  location:               string;
  isRemote:               boolean;
  isHybrid:               boolean;
  openPositions:          number;
  isActive:               boolean;
  paymentConfirmed:       boolean;
  createdAt:              Date;
  updatedAt:              Date;
}

export interface InterviewQuestion {
  id:           string;
  jobPostId:    string;
  order:        number;
  questionText: string;
  timeLimitSec: number;
  idealAnswer?: string | null;
  weight:       number;
  isFlagged:    boolean;
  flagReason?:  string | null;
}

export interface JobPostFormData {
  title:                  string;
  description:            string;
  requiredQualifications: string;
  preferredQualifications?: string;
  salaryMin?:             number;
  salaryMax?:             number;
  location:               string;
  isRemote:               boolean;
  isHybrid:               boolean;
  openPositions:          number;
}

export interface JobPostWithCompany extends JobPost {
  company: { name: string; logo?: string | null; averageRating: number; meritPledgeSigned: boolean; };
  questions: InterviewQuestion[];
  _count: { applications: number };
}
