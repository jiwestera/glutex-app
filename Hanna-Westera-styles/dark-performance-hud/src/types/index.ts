export type TargetRegion = 
  | 'Gluteus Maximus' 
  | 'Gluteus Medius' 
  | 'Gluteus Minimus' 
  | 'Hamstrings & Tie-in' 
  | 'Quads & Hip Flexors'
  | 'Legs & Calves'
  | 'Chest'
  | 'Back & Lats'
  | 'Shoulders & Arms'
  | 'Full Body'
  | string;

export type GluteRegion = TargetRegion;

export type BodyGroup = 'Glutes' | 'Legs' | 'Upper Body' | 'Chest' | 'Back' | 'Arms' | 'Core' | 'Full Body';

export type ExerciseCategory =
  | 'Compound Heavy'
  | 'Stretch Focus'
  | 'Shortened Peak'
  | 'Abduction & Upper Shelf'
  | 'Mobility & Activation'
  | 'Upper Push'
  | 'Upper Pull'
  | 'Arms & Shoulders'
  | 'Legs Isolation'
  | 'Core & Stability'
  | 'Full Body Conditioning';

export type EquipmentType = 
  | 'Barbell' 
  | 'Dumbbell' 
  | 'Cable' 
  | 'Machine' 
  | 'Resistance Band' 
  | 'Bodyweight' 
  | 'Smith Machine'
  | 'Kettlebell';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetRegion: TargetRegion;
  bodyGroup?: BodyGroup;
  secondaryRegions?: TargetRegion[];
  equipment: EquipmentType;
  description: string;
  setupInstructions: string[];
  techniqueCues: string[];
  commonMistakes: string[];
  biomechanicsType: 'Shortened Position' | 'Stretch Position' | 'Mid-Range' | 'Abduction' | 'Activation' | 'Push/Pull' | 'Isolation' | 'Compound';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface PlannedExercise {
  exerciseId: string;
  sets: number;
  reps: string; // e.g. "8-10" or "12-15"
  rpe: string; // e.g. "RPE 8"
  restSeconds: number;
  notes?: string;
  alternativeExerciseIds?: string[];
}

export interface WorkoutDay {
  dayNumber: number;
  title: string; // e.g. "Glute Max Strength & Shortened Peak"
  focus: string;
  estimatedMinutes: number;
  warmupMobilityIds: string[];
  exercises: PlannedExercise[];
}

export interface WorkoutSplit {
  id: string;
  daysPerWeek: number; // 2, 3, 4, 5, 6
  name: string;
  tagline: string;
  description: string;
  weeklyVolumeNotes: string;
  idealDaysSchedule: string;
  days: WorkoutDay[];
}

export interface MobilityStep {
  name: string;
  durationOrReps: string; // e.g. "45s per side" or "10 reps"
  instructions: string;
  keyBenefit: string;
  targetArea: string;
}

export interface MobilityRoutine {
  id: string;
  name: string;
  category: 'Pre-Workout Activation' | 'Hip Mobility & Flow' | 'Post-Workout Cool Down' | 'Deactivation & Release';
  durationMinutes: number;
  description: string;
  steps: MobilityStep[];
}

export interface LoggedSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  rpe?: number;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: LoggedSet[];
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  splitId: string;
  dayNumber: number;
  dayTitle: string;
  durationSeconds: number;
  exercises: LoggedExercise[];
  notes?: string;
  feelingRating?: number; // 1-5
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeightKg: number;
  maxReps: number;
  estimated1RM: number;
  date: string;
}

export type UnitSystem = 'kg' | 'lbs';
