export type CompanyStatus = "PENDING" | "APPROVED" | "SUSPENDED";

export interface CompanyProfile {
  id:                string;
  userId:            string;
  name:              string;
  logo?:             string | null;
  address?:          string | null;
  contactPerson?:    string | null;
  phone?:            string | null;
  website?:          string | null;
  industry?:         string | null;
  annualRevenue?:    string | null;
  meritPledgeSigned: boolean;
  meritPledgeDate?:  Date | null;
  status:            CompanyStatus;
  averageRating:     number;
  totalRatings:      number;
  annualPaid:        boolean;
  createdAt:         Date;
  updatedAt:         Date;
}

export interface CompanyProfileFormData {
  name:              string;
  logo?:             File | null;
  address?:          string;
  contactPerson?:    string;
  phone?:            string;
  website?:          string;
  industry?:         string;
  annualRevenue?:    string;
  meritPledgeSigned: boolean;
}

export interface CompanyRating {
  id:        string;
  companyId: string;
  rating:    number;
  review?:   string | null;
  isVisible: boolean;
  createdAt: Date;
}
