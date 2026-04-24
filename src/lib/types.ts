export interface BannerAlertData {
  id: string;
  eqsafeNumber: string;
  bannerColour: string;
  bannerType: string;
  dateOfIncident: string;
  timeOfIncident: string | null;
  directorateRegion: string | null;
  mainRoadsOrContractor: string | null;
  eqsafeEventType: string | null;
  actualConsequence: string | null;
  potentialConsequence: string | null;
  incidentShortDesc: string;
  executiveSummary: string | null;
  contributingFactors: string | null;
  correctiveActions: string | null;
  icamInvestigation: boolean;
  trafficControlRelated: boolean;
  trafficControlNotes: string | null;
  criticalRiskProfile: string | null;
  incidentCategory: string | null;
  region: string | null;
  pdfPath: string | null;
  pdfFilename: string | null;
  indexedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatsData {
  total: number;
  red: number;
  amber: number;
  grey: number;
  tcRelated: number;
  icamActive: number;
  icamComplete: number;
  noIcam: number;
  categoryBreakdown: { category: string; count: number }[];
  regionBreakdown: { region: string; count: number }[];
}

export interface FilterState {
  colour: string | null;
  category: string | null;
  region: string | null;
  icam: string | null;
  tc: boolean;
  search: string;
}

export const BANNER_COLOURS = [
  { value: 'red', label: 'Red Banner', emoji: '🔴', description: 'Preliminary Notice' },
  { value: 'amber', label: 'Amber Banner', emoji: '🟡', description: 'Intermediate' },
  { value: 'grey', label: 'Grey Banner', emoji: '⚪', description: 'Final Notice' },
] as const;

export const INCIDENT_CATEGORIES = [
  'Vehicle & Driving',
  'Traffic Control',
  'Manual Handling',
  'Equipment & Tools',
  'Slips, Trips & Falls',
  'Environmental',
] as const;

export const REGIONS = [
  'Kimberley',
  'Mid West / Gascoyne',
  'Goldfields-Esperance',
  'Great Southern',
  'Wheatbelt',
  'GSR',
] as const;

export const ICAM_STATUSES = [
  { value: 'active', label: 'ICAM Active' },
  { value: 'complete', label: 'ICAM Complete' },
  { value: 'none', label: 'No ICAM' },
] as const;

// TGS/MMS Types
export interface SpacingValue {
  postedSpeed_kmh: number;
  D_m: number;
  note?: string;
}

export interface WorksiteSpeedRule {
  distanceFromLane: string;
  worksiteSpeed_kmh: number;
  rfReference: string;
}

export interface ApproachFrame {
  id: string;
  plate1: string;
  plate2: string | null;
  plate3: string | null;
  frameType: 'single' | 'double' | 'triple';
  hasReverseSide: boolean;
  mmsCodes: string[];
  reverseSide?: {
    plate1: string;
    plate2: string;
    plate3: string;
    mmsCodes: string[];
  };
}

export interface FrameLayout {
  title: string;
  postedSpeed: string;
  worksiteSpeed: string;
  worksiteProximity: string;
  tmpPage: number;
  drawingNo: string;
  approachFrames: ApproachFrame[];
  spacings: Record<string, string>;
}

export interface MmsCodeRef {
  code: string;
  type: 'regulatory' | 'advisory' | 'termination';
  description: string;
}

export interface CommonMistake {
  mistake: string;
  correct: string;
  wrong: string;
}

export interface ConditionalRule {
  firstFrameSpacing?: string;
  aheadSignRequired?: boolean;
  aheadSignDescription?: string;
  prepareToStopDistance?: string;
  reduceSpeedRequired?: boolean;
  endOfQueueProtectionRequired?: boolean;
  endOfQueueReference?: string;
  reduceSpeedNotRequired?: boolean;
  endOfQueueProtectionNotRequired?: boolean;
}

export interface TgsData {
  spacingTable: {
    source: string;
    description: string;
    values: SpacingValue[];
  };
  worksiteSpeedRules: WorksiteSpeedRule[];
  speedFrameTemplate: {
    description: string;
    firstSpeedFrame: {
      plate1: string;
      plate2: string;
      plate3: string;
      mmsCodes: string[];
    };
    subsequentSpeedFrame: {
      plate1: string;
      plate2: string;
      plate3: string;
      mmsCodes: string[];
    };
  };
  trafficControlFrames: {
    position: string;
    plate1: string;
    plate2: string | null;
    plate3: string | null;
    frameType: string;
    mmsCodes: string[];
  }[];
  departureTemplate: {
    description: string;
    plate1: string;
    plate2: string;
    plate3: string;
    mmsCodes: string[];
  };
  conditionalRules: {
    postedSpeedGte100: ConditionalRule;
    postedSpeedGte80: ConditionalRule;
    postedSpeedLt80: ConditionalRule;
  };
  frameLayouts: Record<string, FrameLayout>;
  mmsCodeReference: MmsCodeRef[];
  commonMistakes: CommonMistake[];
}

export function getColourClasses(colour: string) {
  switch (colour) {
    case 'red':
      return {
        border: 'border-l-red-500',
        bg: 'bg-red-50',
        badge: 'bg-red-100 text-red-800 border-red-200',
        dot: 'bg-red-500',
        text: 'text-red-700',
        hover: 'hover:border-red-300',
      };
    case 'amber':
      return {
        border: 'border-l-amber-500',
        bg: 'bg-amber-50',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        hover: 'hover:border-amber-300',
      };
    case 'grey':
      return {
        border: 'border-l-slate-400',
        bg: 'bg-slate-50',
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        text: 'text-slate-600',
        hover: 'hover:border-slate-300',
      };
    default:
      return {
        border: 'border-l-slate-300',
        bg: 'bg-white',
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-300',
        text: 'text-slate-600',
        hover: 'hover:border-slate-300',
      };
  }
}
