import { WorkoutSplit } from '../types';

export const prebuiltSplits: WorkoutSplit[] = [
  // -------------------------------------------------------------
  // 2 DAYS / WEEK SPLIT
  // -------------------------------------------------------------
  {
    id: 'split-2-days',
    daysPerWeek: 2,
    name: '2-Day Ultra-Efficient Glute Hypertrophy',
    tagline: "Full recovery, max stimulus. It's possible to add training days for more variety.",
    description: 'Designed for busy individuals or cross-training athletes. Every session delivers high-yield compound movements combining peak shorten resistance (Hip Thrust) and deep stretch loading (RDL/Bulgarian).',
    weeklyVolumeNotes: '14-16 total direct glute sets per week (7-8 sets per session). Perfect for full recovery.',
    idealDaysSchedule: 'Monday / Thursday (or Tuesday / Friday) to allow 72 hours rest between sessions.',
    days: [
      {
        dayNumber: 1,
        title: 'Lower Body A: Glute Max Strength & Peak Contraction',
        focus: 'Heavy Hip Thrusts + Deep Stretch RDLs',
        estimatedMinutes: 50,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'barbell-hip-thrust',
            sets: 4,
            reps: '8-10',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Primary heavy lift. Hold 1s pause at the top of every rep.'
          },
          {
            exerciseId: 'dumbbell-rdl',
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Focus on maximum hip setback. Keep dumbbells hugging your shins.'
          },
          {
            exerciseId: 'bulgarian-split-squat-glute',
            sets: 3,
            reps: '10-12 / leg',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Torso angled forward 45° to load the working glute.'
          },
          {
            exerciseId: 'seated-machine-hip-abduction',
            sets: 3,
            reps: '15-20',
            rpe: 'RPE 9',
            restSeconds: 60,
            notes: 'Burnout set for upper glute shelf. Slow 3s negative.'
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Lower Body B: Single-Leg Precision & Upper Shelf',
        focus: 'Unilateral Glute Max + Medius Specialization',
        estimatedMinutes: 50,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'kas-glute-bridge',
            sets: 4,
            reps: '10-12',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Partial range of motion focusing strictly on top contraction.'
          },
          {
            exerciseId: 'deficit-reverse-lunge',
            sets: 3,
            reps: '10-12 / leg',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Step off 2-3 inch plate for extra deep stretch.'
          },
          {
            exerciseId: 'hyperextension-45-glute',
            sets: 3,
            reps: '12-15',
            rpe: 'RPE 8',
            restSeconds: 75,
            notes: 'Upper back rounded, toes flared out at 45°.'
          },
          {
            exerciseId: 'cable-standing-hip-abduction',
            sets: 3,
            reps: '15-18 / leg',
            rpe: 'RPE 9',
            restSeconds: 60,
            notes: 'Kick diagonally back at 30° angle.'
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 3 DAYS / WEEK SPLIT
  // -------------------------------------------------------------
  {
    id: 'split-3-days',
    daysPerWeek: 3,
    name: '3-Day Sweet Spot Hypertrophy',
    tagline: "Balanced recovery & frequency. It's possible to add training days for more variety.",
    description: 'Strikes the optimal balance between high frequency, sufficient volume, and ample recovery days. Targets all three gluteal heads across different loading angles.',
    weeklyVolumeNotes: '18-20 total direct glute sets per week (6-7 sets per session). High hypertrophy response.',
    idealDaysSchedule: 'Monday / Wednesday / Friday or Tuesday / Thursday / Saturday.',
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Heavy Glute Max Power & Shortened Peak',
        focus: 'Barbell Hip Thrust Heavy + Kas Bridge',
        estimatedMinutes: 55,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'barbell-hip-thrust',
            sets: 4,
            reps: '6-8',
            rpe: 'RPE 8-9',
            restSeconds: 150,
            notes: 'Progressive overload primary set. Drive through heels.'
          },
          {
            exerciseId: 'dumbbell-rdl',
            sets: 3,
            reps: '8-10',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Controlled 3-second descent into deep ham/glute stretch.'
          },
          {
            exerciseId: 'cable-standing-hip-abduction',
            sets: 3,
            reps: '12-15 / leg',
            rpe: 'RPE 8',
            restSeconds: 60,
            notes: 'Upper shelf glute medius activation.'
          },
          {
            exerciseId: 'dumbbell-walking-lunge',
            sets: 3,
            reps: '12-15 / leg',
            rpe: 'RPE 9',
            restSeconds: 45,
            notes: 'High-rep burnout to finish session.'
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: Glute Stretch & Unilateral Balance',
        focus: 'Bulgarian Split Squats + Deficit Lunges',
        estimatedMinutes: 50,
        warmupMobilityIds: ['deep-hip-flow'],
        exercises: [
          {
            exerciseId: 'bulgarian-split-squat-glute',
            sets: 4,
            reps: '8-10 / leg',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Dumbbells at side, torso forward lean.'
          },
          {
            exerciseId: 'deficit-reverse-lunge',
            sets: 3,
            reps: '10-12 / leg',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Deep stretch at bottom of movement.'
          },
          {
            exerciseId: 'seated-machine-hip-abduction',
            sets: 4,
            reps: '15-20',
            rpe: 'RPE 9',
            restSeconds: 60,
            notes: 'Pause 1s at maximum abduction.'
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Upper Shelf & Glute-Ham Tie-In',
        focus: 'Kas Bridge + 45° Hyperextension + Cable Kickbacks',
        estimatedMinutes: 50,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'kas-glute-bridge',
            sets: 4,
            reps: '10-12',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Constant tension without dropping all the way to floor.'
          },
          {
            exerciseId: 'hyperextension-45-glute',
            sets: 3,
            reps: '12-15',
            rpe: 'RPE 8',
            restSeconds: 75,
            notes: 'Hug weight plate to chest, rounded thoracic spine.'
          },
          {
            exerciseId: 'cable-glute-kickback',
            sets: 3,
            reps: '12-15 / leg',
            rpe: 'RPE 8',
            restSeconds: 60,
            notes: 'Squeeze hard at top extension.'
          },
          {
            exerciseId: 'banded-side-clamshell',
            sets: 2,
            reps: '20 / side',
            rpe: 'RPE 9',
            restSeconds: 45,
            notes: 'Side glute pump finisher.'
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 4 DAYS / WEEK SPLIT
  // -------------------------------------------------------------
  {
    id: 'split-4-days',
    daysPerWeek: 4,
    name: '4-Day Glute Specialization & Upper Shelf Focus',
    tagline: "High-volume glute specialization. It's possible to add exercises for more variety.",
    description: 'Perfect for intermediate lifters looking to maximize growth. Rotates between heavy strength days and targeted isolation/abduction days.',
    weeklyVolumeNotes: '22-24 total glute sets per week. Rotates heavy loading and high-rep pumping.',
    idealDaysSchedule: 'Mon / Tue / Thu / Fri (Wed & Weekend off for optimal recovery).',
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Heavy Glute Max Thrust & RDL',
        focus: 'Barbell Thrust + Heavy RDL',
        estimatedMinutes: 55,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'barbell-hip-thrust',
            sets: 4,
            reps: '6-8',
            rpe: 'RPE 8-9',
            restSeconds: 150,
            notes: 'Heavy weight, explosive drive up.'
          },
          {
            exerciseId: 'dumbbell-rdl',
            sets: 4,
            reps: '8-10',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Control eccentric for 3 full seconds.'
          },
          {
            exerciseId: 'cable-standing-hip-abduction',
            sets: 3,
            reps: '15 / leg',
            rpe: 'RPE 8',
            restSeconds: 60,
            notes: 'Focus on upper outer glute.'
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: Unilateral Stretch & Quad-Glute Integration',
        focus: 'Bulgarian Split Squat + Step-Ups',
        estimatedMinutes: 50,
        warmupMobilityIds: ['deep-hip-flow'],
        exercises: [
          {
            exerciseId: 'bulgarian-split-squat-glute',
            sets: 4,
            reps: '10 / leg',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Leaning forward 45°.'
          },
          {
            exerciseId: 'step-up-glute-bias',
            sets: 3,
            reps: '10-12 / leg',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'No jumping off the back toe.'
          },
          {
            exerciseId: 'seated-machine-hip-abduction',
            sets: 4,
            reps: '15-20',
            rpe: 'RPE 9',
            restSeconds: 60,
            notes: 'High rep pump.'
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Glute Max Peak Contraction & Hamstring Tie-In',
        focus: 'Kas Bridge + 45° Hyperextension',
        estimatedMinutes: 50,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'kas-glute-bridge',
            sets: 4,
            reps: '10-12',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Shortened range peak burn.'
          },
          {
            exerciseId: 'hyperextension-45-glute',
            sets: 4,
            reps: '12-15',
            rpe: 'RPE 8',
            restSeconds: 75,
            notes: 'Thoracic flexion maintained.'
          },
          {
            exerciseId: 'cable-glute-kickback',
            sets: 3,
            reps: '12-15 / leg',
            rpe: 'RPE 8',
            restSeconds: 60,
            notes: 'Squeeze glute at top.'
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Day 4: Upper Shelf Abduction & Glute Burnout',
        focus: 'High-Rep Abduction + Deficit Lunges + Frog Pumps',
        estimatedMinutes: 45,
        warmupMobilityIds: ['desk-worker-reset'],
        exercises: [
          {
            exerciseId: 'deficit-reverse-lunge',
            sets: 3,
            reps: '12 / leg',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Deep deficit stretch.'
          },
          {
            exerciseId: 'seated-machine-hip-abduction',
            sets: 4,
            reps: '20',
            rpe: 'RPE 9',
            restSeconds: 60,
            notes: 'Lean forward slightly on machine.'
          },
          {
            exerciseId: 'cable-standing-hip-abduction',
            sets: 3,
            reps: '15 / leg',
            rpe: 'RPE 9',
            restSeconds: 60,
            notes: 'Diagonally back.'
          },
          {
            exerciseId: 'frog-pump',
            sets: 3,
            reps: '30',
            rpe: 'RPE 10',
            restSeconds: 45,
            notes: 'Finisher.'
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 5 DAYS / WEEK SPLIT
  // -------------------------------------------------------------
  {
    id: 'split-5-days',
    daysPerWeek: 5,
    name: '5-Day Glute Building Specialization',
    tagline: "High-frequency specialization. It's possible to add exercises for more variety.",
    description: 'Spreads weekly sets into 5 shorter, highly focused sessions (approx 40-45 mins each). Ensures ultra-fresh muscles on every set with zero junk volume.',
    weeklyVolumeNotes: '25-28 total direct glute sets per week managed with variable daily intensity.',
    idealDaysSchedule: 'Mon / Tue / Wed / Fri / Sat (Thu & Sun off).',
    days: [
      {
        dayNumber: 1,
        title: 'Day 1: Heavy Glute Max Thrust',
        focus: 'Barbell Hip Thrust Strength',
        estimatedMinutes: 45,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'barbell-hip-thrust',
            sets: 5,
            reps: '6-8',
            rpe: 'RPE 8-9',
            restSeconds: 150,
            notes: 'Heavy compound drive.'
          },
          {
            exerciseId: 'cable-standing-hip-abduction',
            sets: 3,
            reps: '15 / leg',
            rpe: 'RPE 8',
            restSeconds: 60,
            notes: 'Upper shelf touch up.'
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2: Deep Stretch & Hamstrings',
        focus: 'Dumbbell RDL + Hyperextensions',
        estimatedMinutes: 45,
        warmupMobilityIds: ['deep-hip-flow'],
        exercises: [
          {
            exerciseId: 'dumbbell-rdl',
            sets: 4,
            reps: '8-10',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Deep stretch loading.'
          },
          {
            exerciseId: 'hyperextension-45-glute',
            sets: 3,
            reps: '12-15',
            rpe: 'RPE 8',
            restSeconds: 75,
            notes: 'Glute-biased extension.'
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3: Unilateral Glute Power',
        focus: 'Bulgarian Split Squat + Deficit Lunge',
        estimatedMinutes: 45,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'bulgarian-split-squat-glute',
            sets: 4,
            reps: '10 / leg',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Single leg power.'
          },
          {
            exerciseId: 'deficit-reverse-lunge',
            sets: 3,
            reps: '10 / leg',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Deficit step.'
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'Day 4: Upper Shelf Medius & Minimus Focus',
        focus: 'Seated Abduction + Cable Kickbacks',
        estimatedMinutes: 40,
        warmupMobilityIds: ['desk-worker-reset'],
        exercises: [
          {
            exerciseId: 'seated-machine-hip-abduction',
            sets: 4,
            reps: '18-20',
            rpe: 'RPE 9',
            restSeconds: 60,
            notes: 'Hold at top.'
          },
          {
            exerciseId: 'cable-glute-kickback',
            sets: 4,
            reps: '12-15 / leg',
            rpe: 'RPE 8',
            restSeconds: 60,
            notes: 'Kickback precision.'
          },
          {
            exerciseId: 'banded-side-clamshell',
            sets: 3,
            reps: '20 / side',
            rpe: 'RPE 9',
            restSeconds: 45,
            notes: 'Side glute density.'
          }
        ]
      },
      {
        dayNumber: 5,
        title: 'Day 5: Kas Bridge & Glute Burnout',
        focus: 'Kas Bridge + Frog Pumps',
        estimatedMinutes: 40,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: [
          {
            exerciseId: 'kas-glute-bridge',
            sets: 4,
            reps: '10-12',
            rpe: 'RPE 8-9',
            restSeconds: 120,
            notes: 'Shortened range intensity.'
          },
          {
            exerciseId: 'step-up-glute-bias',
            sets: 3,
            reps: '10 / leg',
            rpe: 'RPE 8',
            restSeconds: 90,
            notes: 'Controlled tempo.'
          },
          {
            exerciseId: 'frog-pump',
            sets: 3,
            reps: '30',
            rpe: 'RPE 10',
            restSeconds: 45,
            notes: 'Final pump.'
          }
        ]
      }
    ]
  }
];
