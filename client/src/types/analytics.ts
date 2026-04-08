export interface CollegeTypeData {
  name: string;
  value: number;
}

export interface CollegesByStateData {
  state: string;
  count: number;
}

export interface FeeAnalysisData {
  type: string;
  avgMin: number;
  avgMax: number;
  count: number;
}

export interface ScoreDistributionData {
  range: string;
  count: number;
}

export interface TierBreakdownData {
  name: string;
  value: number;
}

export interface FacilityData {
  facility: string;
  count: number;
}

export interface FullAnalytics {
  totalColleges: number;
  statesCovered: number;
  typeDistribution: CollegeTypeData[];
  byState: CollegesByStateData[];
  feeAnalysis: FeeAnalysisData[];
  scoreDistribution: ScoreDistributionData[];
  tierBreakdown: TierBreakdownData[];
  topFacilities: FacilityData[];
}

export interface PublicInsights {
  totalColleges: number;
  typeDistribution: CollegeTypeData[];
  byState: CollegesByStateData[];
  feeAnalysis: FeeAnalysisData[];
  tierBreakdown: TierBreakdownData[];
  topFacilities: FacilityData[];
}
