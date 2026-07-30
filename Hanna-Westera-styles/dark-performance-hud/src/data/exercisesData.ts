import { Exercise } from '../types';

export const exercisesData: Exercise[] = [
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust',
    category: 'Shortened Peak',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Hamstrings & Tie-in'],
    equipment: 'Barbell',
    description: 'The king of glute hypertrophy exercises. Provides peak resistance at maximum hip extension where glute contraction is highest.',
    setupInstructions: [
      'Sit on floor with upper back against a bench (aligned just below scapulae).',
      'Roll loaded barbell over legs to rest right in the hip crease (use a pad!).',
      'Plant feet flat, shoulder-width apart, knees stacked directly over ankles at the top.'
    ],
    techniqueCues: [
      'Drive through your heels and tuck chin down slightly toward chest.',
      'Squeeze glutes hard at the top until hips achieve full 180° lockout.',
      'Keep ribcage down and avoid arching your lower back at lockout.'
    ],
    commonMistakes: [
      'Hyperextending lumbar spine at top instead of rotating pelvis into posterior tilt.',
      'Placing feet too far forward (shifts load to hamstrings) or too close (shifts load to quads).'
    ],
    biomechanicsType: 'Shortened Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'kas-glute-bridge',
    name: 'Kas Glute Bridge',
    category: 'Shortened Peak',
    targetRegion: 'Gluteus Maximus',
    equipment: 'Barbell',
    description: 'A higher-isolation variant of the hip thrust with reduced knee flexion, isolating glute max peak contraction with minimal quad fatigue.',
    setupInstructions: [
      'Position back against bench just like a barbell hip thrust.',
      'Keep movement strictly at the hip joint with minimal downward knee movement.'
    ],
    techniqueCues: [
      'Lower hips only 4 to 6 inches before driving straight back up to full peak contraction.',
      'Maintain continuous tension on the glutes throughout the partial range of motion.'
    ],
    commonMistakes: [
      'Dropping too low and turning it into a regular hip thrust.',
      'Rushing the top pause.'
    ],
    biomechanicsType: 'Shortened Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'dumbbell-rdl',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Hamstrings & Tie-in'],
    equipment: 'Dumbbell',
    description: 'An essential stretch-position builder that targets the gluteus maximus under loaded length, fostering maximum mechanical strain.',
    setupInstructions: [
      'Stand upright holding dumbbells in front of thighs with neutral spine and soft knees.',
      'Pull shoulders back and brace core tight.'
    ],
    techniqueCues: [
      'Push your hips directly backwards as if trying to press a button behind you with your glutes.',
      'Keep dumbbells tracing down close to shins; stop when hips can no longer push back.'
    ],
    commonMistakes: [
      'Bending at lower back instead of hinging at hips.',
      'Bending knees excessively into a squat movement.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Beginner'
  },
  {
    id: 'bulgarian-split-squat-glute',
    name: 'Bulgarian Split Squat (Glute Bias)',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Quads & Hip Flexors', 'Gluteus Medius'],
    equipment: 'Dumbbell',
    description: 'Single-leg unilateral power movement emphasizing deep glute stretch with forward torso angle.',
    setupInstructions: [
      'Place top of rear foot flat on a bench behind you.',
      'Step forward with front working leg far enough to allow deep hip flex with forward torso lean.'
    ],
    techniqueCues: [
      'Lean torso forward at a 45-degree angle to keep load on front glute.',
      'Lower hips diagonally down and back, reaching a deep stretch before pushing up through front heel.'
    ],
    commonMistakes: [
      'Staying completely upright (which shifts tension to quads instead of glutes).',
      'Pushing through back leg toes.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'cable-standing-hip-abduction',
    name: 'Cable Standing Hip Abduction',
    category: 'Abduction & Upper Shelf',
    targetRegion: 'Gluteus Medius',
    secondaryRegions: ['Gluteus Minimus'],
    equipment: 'Cable',
    description: 'Isolates the upper shelf of the glutes (gluteus medius/minimus) using constant cable tension.',
    setupInstructions: [
      'Attach ankle strap to low cable pulley.',
      'Stand perpendicular to cable tower, holding frame for support, leaning slightly forward.'
    ],
    techniqueCues: [
      'Kick working leg diagonally out and back at roughly a 30-degree angle.',
      'Keep toe pointed slightly inward/downward to maximize medius engagement.'
    ],
    commonMistakes: [
      'Swinging torso momentum.',
      'Flaring toe outwards which rotates hip to involve hip flexors.'
    ],
    biomechanicsType: 'Abduction',
    difficulty: 'Beginner'
  },
  {
    id: 'hyperextension-45-glute',
    name: '45-Degree Hyperextension (Glute Bias)',
    category: 'Shortened Peak',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Hamstrings & Tie-in'],
    equipment: 'Bodyweight',
    description: 'By rounding upper back slightly and flaring feet out, this exercise shifts load directly onto glute max peak contraction.',
    setupInstructions: [
      'Adjust bench pad so top edge sits right below your hip crease.',
      'Turn toes outward at a 45-degree angle.'
    ],
    techniqueCues: [
      'Round upper back (thoracic flexion) and hug a plate to chest.',
      'Hinge at waist down, then scoop hips forward and squeeze glutes hard at the top.'
    ],
    commonMistakes: [
      'Arching lower back/lumbar spine to gain height.',
      'Keeping upper back flat which engages spinal erectors.'
    ],
    biomechanicsType: 'Shortened Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'seated-machine-hip-abduction',
    name: 'Seated Machine Hip Abduction',
    category: 'Abduction & Upper Shelf',
    targetRegion: 'Gluteus Medius',
    secondaryRegions: ['Gluteus Minimus'],
    equipment: 'Machine',
    description: 'High-stability machine exercise to build the upper glute shelf and lateral hip density.',
    setupInstructions: [
      'Sit on abduction machine with back firm or slightly leaning forward for deeper stretch.',
      'Place outer knees firmly against pads.'
    ],
    techniqueCues: [
      'Drive knees outwards as far as possible, pausing for 1 second at full expansion.',
      'Control the eccentric return slowly for 3 seconds.'
    ],
    commonMistakes: [
      'Using momentum to slam weights.',
      'Rushing the negative phase.'
    ],
    biomechanicsType: 'Abduction',
    difficulty: 'Beginner'
  },
  {
    id: 'deficit-reverse-lunge',
    name: 'Deficit Reverse Lunge',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Quads & Hip Flexors'],
    equipment: 'Dumbbell',
    description: 'Standing on a step or bumper plate increases range of motion, providing a deeper glute stretch at the bottom.',
    setupInstructions: [
      'Stand on a 2-4 inch platform or weight plate holding dumbbells.',
      'Step back off the plate into a reverse lunge.'
    ],
    techniqueCues: [
      'Hinge torso forward slightly over front knee.',
      'Lower rear knee toward floor until front glute reaches maximal loaded stretch.'
    ],
    commonMistakes: [
      'Not stepping back far enough.',
      'Allowing front heel to lift off the deficit platform.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'cable-glute-kickback',
    name: 'Cable Glute Kickback',
    category: 'Shortened Peak',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Gluteus Medius'],
    equipment: 'Cable',
    description: 'Isolation exercise focusing on peak hip extension with continuous cable resistance.',
    setupInstructions: [
      'Attach ankle cuff to low cable.',
      'Hinge forward at waist holding cable column for balance.'
    ],
    techniqueCues: [
      'Drive heel back and up in an arc, squeezing glute at top.',
      'Maintain stable core and quiet pelvis.'
    ],
    commonMistakes: [
      'Arching lumbar spine at top of kick.',
      'Swinging leg forward aggressively.'
    ],
    biomechanicsType: 'Shortened Position',
    difficulty: 'Beginner'
  },
  {
    id: 'step-up-glute-bias',
    name: 'Step-Up (Glute & Hip Hinge Bias)',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    equipment: 'Dumbbell',
    description: 'Single-leg loading with controlled negative that builds functional glute drive and hip stability.',
    setupInstructions: [
      'Choose a box height where knee sits at roughly 90° or slightly higher.',
      'Place entire front foot securely on box with slight torso forward lean.'
    ],
    techniqueCues: [
      'Drive through working front heel without bouncing off rear leg toes.',
      'Lower back down over a slow 3-second tempo.'
    ],
    commonMistakes: [
      'Pushing off back foot calf/toe.',
      'Box height too high causing hip hiking.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'frog-pump',
    name: 'Frog Pump',
    category: 'Mobility & Activation',
    targetRegion: 'Gluteus Maximus',
    equipment: 'Bodyweight',
    description: 'Bodyweight burnout & activation exercise placing hips in external rotation for intense glute isolation.',
    setupInstructions: [
      'Lying on back, press soles of feet together with knees flared wide like a frog.',
      'Bring heels close to pelvis.'
    ],
    techniqueCues: [
      'Tuck chin to chest and lift hips up by squeezing glutes.',
      'Perform rapid controlled reps focusing purely on top contraction.'
    ],
    commonMistakes: [
      'Arching lower back.',
      'Separating feet.'
    ],
    biomechanicsType: 'Activation',
    difficulty: 'Beginner'
  },
  {
    id: 'banded-side-clamshell',
    name: 'Banded Side Clamshell',
    category: 'Mobility & Activation',
    targetRegion: 'Gluteus Medius',
    secondaryRegions: ['Gluteus Minimus'],
    equipment: 'Resistance Band',
    description: 'Essential primer to awaken gluteus medius external rotation and stabilize hip joint.',
    setupInstructions: [
      'Place mini loop band around legs just above knees.',
      'Lie on side with knees bent at 90° and feet aligned with spine.'
    ],
    techniqueCues: [
      'Keep heels glued together while lifting top knee as high as possible.',
      'Hold 1-2 seconds at peak elevation.'
    ],
    commonMistakes: [
      'Rolling hips backwards as knee lifts.'
    ],
    biomechanicsType: 'Activation',
    difficulty: 'Beginner'
  },
  {
    id: 'dumbbell-hip-thrust',
    name: 'Dumbbell Hip Thrust',
    category: 'Shortened Peak',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Hamstrings & Tie-in'],
    equipment: 'Dumbbell',
    description: 'A versatile dumbbell alternative to the barbell hip thrust. Ideal for home workouts, dumbbell setups, or quick supersets.',
    setupInstructions: [
      'Sit on floor with upper back against a bench.',
      'Place a heavy dumbbell vertically or horizontally across your hip crease (use a pad or towel).',
      'Plant feet flat shoulder-width apart, knees stacked over ankles at top extension.'
    ],
    techniqueCues: [
      'Hold dumbbell securely with both hands.',
      'Drive through heels and squeeze glutes at the top until hips lock out at 180°.',
      'Keep chin tucked slightly toward chest.'
    ],
    commonMistakes: [
      'Allowing dumbbell to roll down thighs during movement.',
      'Arching lower back at top lockout.'
    ],
    biomechanicsType: 'Shortened Position',
    difficulty: 'Beginner'
  },
  {
    id: 'smith-machine-hip-thrust',
    name: 'Smith Machine Hip Thrust',
    category: 'Shortened Peak',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Hamstrings & Tie-in'],
    equipment: 'Smith Machine',
    description: 'Fixed bar path allows maximal stability and continuous mechanical tension on gluteus maximus without balancing a free barbell.',
    setupInstructions: [
      'Position bench parallel to Smith machine bar.',
      'Set bar height so it sits directly over hip crease when seated on floor.',
      'Unrack bar with hips and drive upwards.'
    ],
    techniqueCues: [
      'Drive up smoothly and hold 1-2 second contraction at top lockout.',
      'Maintain chin-tucked posture and tuck ribs.'
    ],
    commonMistakes: [
      'Setting bench too far or too close to fixed vertical rail path.'
    ],
    biomechanicsType: 'Shortened Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'barbell-rdl',
    name: 'Barbell Romanian Deadlift (RDL)',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Hamstrings & Tie-in'],
    equipment: 'Barbell',
    description: 'Heavy barbell hip hinge movement loading the glutes and hamstrings in a deep stretched position.',
    setupInstructions: [
      'Stand holding barbell with overhand grip, feet hip-width apart, knees slightly soft.',
      'Engage lats and keep bar close to thighs.'
    ],
    techniqueCues: [
      'Push hips back towards the wall behind you.',
      'Lower bar down shins until hips stop traveling backwards.',
      'Drive hips forward to return to standing.'
    ],
    commonMistakes: [
      'Rounding lumbar spine.',
      'Allowing bar to drift away from legs.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'cable-pull-through',
    name: 'Cable Pull-Through',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Hamstrings & Tie-in'],
    equipment: 'Cable',
    description: 'Continuous horizontal cable tension through the entire hip hinge, reducing spinal compression while loading glute stretch and lockout.',
    setupInstructions: [
      'Attach rope handle to low cable pulley.',
      'Straddle cable facing away from stack, holding rope between legs with both hands.'
    ],
    techniqueCues: [
      'Reach hips back toward cable tower in a hinge motion.',
      'Drive hips forward powerfully and squeeze glutes hard at lockout.'
    ],
    commonMistakes: [
      'Squatting down instead of hinging hips back.',
      'Using arms to pull weight instead of glutes.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Beginner'
  },
  {
    id: 'single-leg-dumbbell-rdl',
    name: 'Single-Leg Dumbbell RDL',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Gluteus Medius', 'Hamstrings & Tie-in'],
    equipment: 'Dumbbell',
    description: 'Unilateral hinge loading deep glute stretch while recruiting gluteus medius for lateral pelvic stabilization.',
    setupInstructions: [
      'Stand on one leg holding a dumbbell in opposite hand.',
      'Soft bend in working knee, non-working leg extends back as balance counterweight.'
    ],
    techniqueCues: [
      'Hinge forward at hip, keeping hips square to floor.',
      'Squeeze working glute to pull back upright.'
    ],
    commonMistakes: [
      'Opening hip outward toward non-working side.',
      'Rounding back.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'dumbbell-walking-lunge',
    name: 'Dumbbell Walking Lunge (Glute Lean)',
    category: 'Stretch Focus',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Quads & Hip Flexors'],
    equipment: 'Dumbbell',
    description: 'Dynamic forward lunging with a forward torso pitch to maximize glute stretch and drive on every step.',
    setupInstructions: [
      'Hold dumbbells at sides with tall posture.',
      'Take a long stride forward, leaning torso forward 30-45° over lead thigh.'
    ],
    techniqueCues: [
      'Press through front heel to step up into next stride.',
      'Maintain forward lean to keep tension on working glute.'
    ],
    commonMistakes: [
      'Taking strides that are too short (shifts load to quads).',
      'Staying upright.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'dumbbell-sumo-squat',
    name: 'Dumbbell Sumo Squat',
    category: 'Compound Heavy',
    targetRegion: 'Gluteus Maximus',
    secondaryRegions: ['Quads & Hip Flexors', 'Gluteus Medius'],
    equipment: 'Dumbbell',
    description: 'Wide stance squat loading glutes and inner adductors through deep knee and hip flexion.',
    setupInstructions: [
      'Stand with feet wide, toes flared outward 45°.',
      'Hold one heavy dumbbell vertically at chest or hanging between legs.'
    ],
    techniqueCues: [
      'Push knees outward in line with toes as you descend.',
      'Drive through heels and squeeze glutes at the top.'
    ],
    commonMistakes: [
      'Knees caving inward.',
      'Not sinking deep enough.'
    ],
    biomechanicsType: 'Mid-Range',
    difficulty: 'Beginner'
  },
  {
    id: 'dumbbell-kickback',
    name: 'Dumbbell Quadruped Kickback',
    category: 'Shortened Peak',
    targetRegion: 'Gluteus Maximus',
    equipment: 'Dumbbell',
    description: 'Dumbbell alternative for glute kickbacks performed on all fours with a dumbbell tucked behind working knee.',
    setupInstructions: [
      'Get on hands and knees (quadruped position).',
      'Tuck a light-to-moderate dumbbell behind knee crease of working leg.'
    ],
    techniqueCues: [
      'Clamp dumbbell tight with hamstring.',
      'Drive heel up toward ceiling until hip reaches full extension.',
      'Pause 1s at top.'
    ],
    commonMistakes: [
      'Arching lower back at top of kick.',
      'Losing hold on dumbbell.'
    ],
    biomechanicsType: 'Shortened Position',
    difficulty: 'Beginner'
  },
  {
    id: 'side-lying-hip-abduction',
    name: 'Side-Lying Bodyweight Hip Abduction',
    category: 'Abduction & Upper Shelf',
    targetRegion: 'Gluteus Medius',
    secondaryRegions: ['Gluteus Minimus'],
    equipment: 'Bodyweight',
    description: 'Pure bodyweight isolation targeting upper shelf glute medius with zero equipment needed.',
    setupInstructions: [
      'Lie on your side on a mat, bottom knee slightly bent for stability.',
      'Keep top leg straight with foot turned slightly inward/downward.'
    ],
    techniqueCues: [
      'Raise top leg upward and slightly backward.',
      'Hold 1-2 seconds at peak elevation, feeling upper glute squeeze.'
    ],
    commonMistakes: [
      'Turning foot upward toward ceiling.',
      'Swinging leg forward.'
    ],
    biomechanicsType: 'Abduction',
    difficulty: 'Beginner'
  },
  {
    id: 'lateral-band-walk',
    name: 'Lateral Band Monster Walk',
    category: 'Abduction & Upper Shelf',
    targetRegion: 'Gluteus Medius',
    secondaryRegions: ['Gluteus Minimus'],
    equipment: 'Resistance Band',
    description: 'Dynamic resistance band walking exercise that ignites gluteus medius stability and lateral burn.',
    setupInstructions: [
      'Place loop band around ankles or above knees.',
      'Quarter-squat stance with feet hip-width apart.'
    ],
    techniqueCues: [
      'Step laterally while keeping constant tension on the band.',
      'Keep knees pushed outward over toes.'
    ],
    commonMistakes: [
      'Allowing feet to touch together (loses band tension).',
      'Standing completely upright.'
    ],
    biomechanicsType: 'Activation',
    difficulty: 'Beginner'
  },
  // LEGS EXERCISES
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Legs Isolation',
    targetRegion: 'Quads & Hip Flexors',
    bodyGroup: 'Legs',
    secondaryRegions: ['Gluteus Maximus', 'Legs & Calves'],
    equipment: 'Barbell',
    description: 'The foundation leg builder targeting quad strength, core bracing, and overall leg power.',
    setupInstructions: [
      'Unrack bar resting across upper traps, feet slightly wider than shoulder width.',
      'Inhale deep into abdomen and brace core.'
    ],
    techniqueCues: [
      'Break at hips and knees simultaneously, lowering until thighs reach parallel.',
      'Drive evenly through middle of foot to return upright.'
    ],
    commonMistakes: [
      'Knees collapsing inward on ascent.',
      'Allowing chest to collapse forward.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },
  {
    id: 'leg-press-machine',
    name: '45-Degree Leg Press',
    category: 'Legs Isolation',
    targetRegion: 'Quads & Hip Flexors',
    bodyGroup: 'Legs',
    secondaryRegions: ['Gluteus Maximus'],
    equipment: 'Machine',
    description: 'High-output leg strength builder allowing heavy quad loading with spine support.',
    setupInstructions: [
      'Sit with back flat against pad and feet hip-width apart in middle of footplate.',
      'Disengage safety latches while keeping knees unlocked.'
    ],
    techniqueCues: [
      'Lower sled until knees reach 90-degree angle without tailbone lifting off pad.',
      'Press sled up through middle foot, stopping just short of knee lockout.'
    ],
    commonMistakes: [
      'Lifting lower back off pad at bottom of range.',
      'Locking out knees aggressively.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Beginner'
  },
  {
    id: 'leg-extension-machine',
    name: 'Seated Leg Extension',
    category: 'Legs Isolation',
    targetRegion: 'Quads & Hip Flexors',
    bodyGroup: 'Legs',
    equipment: 'Machine',
    description: 'Isolated quadriceps extension movement targeting the rectus femoris in peak contraction.',
    setupInstructions: [
      'Adjust seat back so knee joint aligns directly with machine pivot axis.',
      'Position lower pad just above ankles.'
    ],
    techniqueCues: [
      'Extend legs upwards smoothly until quads lock out.',
      'Hold 1 second squeeze at top before lowering under control.'
    ],
    commonMistakes: [
      'Swinging weight with momentum.',
      'Setting lower pad too high up shins.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Hamstring Leg Curl',
    category: 'Legs Isolation',
    targetRegion: 'Hamstrings & Tie-in',
    bodyGroup: 'Legs',
    equipment: 'Machine',
    description: 'Direct hamstring isolation loading knee flexion across a smooth machine tension curve.',
    setupInstructions: [
      'Lie face down with roller pad positioned just below calf muscles.',
      'Grip side handles firm to anchor pelvis.'
    ],
    techniqueCues: [
      'Curl heels up toward glutes smoothly.',
      'Squeeze hamstrings hard at top peak contraction.'
    ],
    commonMistakes: [
      'Arching lower back off bench to cheat weight up.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'standing-calf-raise',
    name: 'Dumbbell / Machine Standing Calf Raise',
    category: 'Legs Isolation',
    targetRegion: 'Legs & Calves',
    bodyGroup: 'Legs',
    equipment: 'Dumbbell',
    description: 'Direct calf muscle (gastrocnemius) hypertrophy loader focusing on deep stretch and peak extension.',
    setupInstructions: [
      'Stand with balls of feet on block edge, heels hanging off.',
      'Hold dumbbell or stand in calf raise machine.'
    ],
    techniqueCues: [
      'Lower heels down slowly into a full comfortable stretch.',
      'Press up onto toes as high as possible and hold 1s.'
    ],
    commonMistakes: [
      'Bouncing rapidly without pausing at top or stretch.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },

  // CHEST EXERCISES
  {
    id: 'barbell-bench-press',
    name: 'Flat Barbell Bench Press',
    category: 'Upper Push',
    targetRegion: 'Chest',
    bodyGroup: 'Chest',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Barbell',
    description: 'Classic heavy compound push for building chest mass, tricep power, and anterior deltoids.',
    setupInstructions: [
      'Lie on flat bench with eyes directly under bar.',
      'Grip bar slightly wider than shoulder width and arch upper back slightly.'
    ],
    techniqueCues: [
      'Unrack bar and lower under control to lower sternum.',
      'Drive feet into floor and press bar up in a subtle arc over chest.'
    ],
    commonMistakes: [
      'Flaring elbows out at 90 degrees (strains shoulders).',
      'Bouncing bar off chest.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Intermediate'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Chest Press',
    category: 'Upper Push',
    targetRegion: 'Chest',
    bodyGroup: 'Chest',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Dumbbell',
    description: 'Targets upper clavicular chest fibers with independent dumbbell freedom of motion.',
    setupInstructions: [
      'Set bench to 30-45 degree incline.',
      'Kick dumbbells up to shoulders and set shoulder blades back.'
    ],
    techniqueCues: [
      'Press dumbbells straight up, converging slightly at top.',
      'Lower slowly until thumbs align with mid-chest.'
    ],
    commonMistakes: [
      'Setting incline too steep (shifts work to front delts).'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Beginner'
  },
  {
    id: 'cable-chest-fly',
    name: 'High-to-Low Cable Chest Fly',
    category: 'Upper Push',
    targetRegion: 'Chest',
    bodyGroup: 'Chest',
    equipment: 'Cable',
    description: 'Isolated chest adduction movement providing continuous tension through mid and lower chest fibers.',
    setupInstructions: [
      'Attach D-handles to high cable pulleys.',
      'Step forward into staggered stance, arms outstretched with slight bend in elbows.'
    ],
    techniqueCues: [
      'Bring handles together in front of waist in a hugging motion.',
      'Squeeze chest muscles tightly together at bottom peak.'
    ],
    commonMistakes: [
      'Pressing weight instead of maintaining consistent elbow angle.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'bodyweight-pushup',
    name: 'Standard Bodyweight Push-Up',
    category: 'Upper Push',
    targetRegion: 'Chest',
    bodyGroup: 'Chest',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Bodyweight',
    description: 'Versatile bodyweight horizontal push strengthening chest, front shoulders, triceps, and core stability.',
    setupInstructions: [
      'Place hands slightly wider than shoulder-width, legs straight behind you on toes.',
      'Keep head, hips, and heels in one rigid line.'
    ],
    techniqueCues: [
      'Lower chest down until elbows reach 90 degrees.',
      'Press floor away aggressively back to start.'
    ],
    commonMistakes: [
      'Sagging hips or arching lower back.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Beginner'
  },

  // BACK EXERCISES
  {
    id: 'lat-pulldown-cable',
    name: 'Wide-Grip Cable Lat Pulldown',
    category: 'Upper Pull',
    targetRegion: 'Back & Lats',
    bodyGroup: 'Back',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Cable',
    description: 'Primary latissimus dorsi builder for back width and upper body pulling strength.',
    setupInstructions: [
      'Sit with thighs secured under thigh pads.',
      'Grip wide bar overhand wider than shoulder width.'
    ],
    techniqueCues: [
      'Pull elbows down toward ribs, driving bar to collarbone.',
      'Squeeze lats hard at bottom before letting bar stretch back up.'
    ],
    commonMistakes: [
      'Leaning back excessively to jerk weight down.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Beginner'
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    category: 'Upper Pull',
    targetRegion: 'Back & Lats',
    bodyGroup: 'Back',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Barbell',
    description: 'Heavy compound row targeting back thickness, lats, rhomboids, and rear deltoids.',
    setupInstructions: [
      'Hinge at hips to a 45-degree angle holding barbell with overhand grip.',
      'Keep spine flat and core engaged.'
    ],
    techniqueCues: [
      'Row bar up to lower ribcage pulling with elbows.',
      'Squeeze shoulder blades together firmly at top.'
    ],
    commonMistakes: [
      'Using momentum to bounce torso up and down.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },
  {
    id: 'single-arm-dumbbell-row',
    name: 'Single-Arm Dumbbell Row',
    category: 'Upper Pull',
    targetRegion: 'Back & Lats',
    bodyGroup: 'Back',
    equipment: 'Dumbbell',
    description: 'Unilateral back pulling movement allowing deep lat stretch and focused single-side contraction.',
    setupInstructions: [
      'Place one knee and hand on flat bench for support.',
      'Hold dumbbell in free hand hanging straight down.'
    ],
    techniqueCues: [
      'Pull dumbbell up toward hip crease keeping elbow close to torso.',
      'Lower dumbbell back down to full stretch.'
    ],
    commonMistakes: [
      'Twisting torso to throw dumbbell up.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Beginner'
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row (Close Grip)',
    category: 'Upper Pull',
    targetRegion: 'Back & Lats',
    bodyGroup: 'Back',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Cable',
    description: 'Horizontal cable row maintaining continuous tension on mid-back, lats, and scapular retractors.',
    setupInstructions: [
      'Sit at row station with feet braced on footrests, knees soft.',
      'Grip V-bar handle with arms extended.'
    ],
    techniqueCues: [
      'Pull handle into abdomen, driving elbows backwards.',
      'Puff chest out and squeeze shoulder blades at peak contraction.'
    ],
    commonMistakes: [
      'Rounding lower back during stretch.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Beginner'
  },

  // ARMS & SHOULDERS EXERCISES
  {
    id: 'dumbbell-overhead-press',
    name: 'Standing Dumbbell Shoulder Press',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    secondaryRegions: ['Chest'],
    equipment: 'Dumbbell',
    description: 'Overhead shoulder pressing builder for front and side deltoid power and tricep extension.',
    setupInstructions: [
      'Stand tall holding dumbbells at shoulder level with palms facing forward.',
      'Brace glutes and core to anchor lower back.'
    ],
    techniqueCues: [
      'Press dumbbells overhead until arms extend straight.',
      'Lower back to shoulder height under control.'
    ],
    commonMistakes: [
      'Arching lower back back excessively.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Beginner'
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    equipment: 'Dumbbell',
    description: 'Isolated side deltoid builder for shoulder width and upper body aesthetic cap.',
    setupInstructions: [
      'Stand upright holding light dumbbells at sides, elbows slightly bent.'
    ],
    techniqueCues: [
      'Raise arms out to sides until parallel with floor.',
      'Lead with elbows and lower down slowly.'
    ],
    commonMistakes: [
      'Shrugging shoulders or swinging body for momentum.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'dumbbell-bicep-curl',
    name: 'Standing Dumbbell Bicep Curl',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    equipment: 'Dumbbell',
    description: 'Classic bicep isolation movement loading arm flexion with palms supinating.',
    setupInstructions: [
      'Stand upright holding dumbbells at arm length with palms facing forward.'
    ],
    techniqueCues: [
      'Curl weights up toward shoulders keeping elbows pinned near ribs.',
      'Squeeze biceps hard at top before lowering smoothly.'
    ],
    commonMistakes: [
      'Swinging hips back and forth to lift weights.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'cable-tricep-pushdown',
    name: 'Cable Rope Tricep Pushdown',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    equipment: 'Cable',
    description: 'Direct tricep elbow extension targeting lateral and medial tricep heads.',
    setupInstructions: [
      'Attach rope attachment to high cable pulley.',
      'Grip rope ends with thumbs up and lean slightly forward.'
    ],
    techniqueCues: [
      'Push rope down until arms lock out, spreading rope ends apart at bottom.',
      'Squeeze triceps for 1 second before controlling return.'
    ],
    commonMistakes: [
      'Allowing elbows to flare or move forward and back.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },

  // FULL BODY & CONDITIONING
  {
    id: 'dumbbell-thruster',
    name: 'Dumbbell Full-Body Thruster',
    category: 'Full Body Conditioning',
    targetRegion: 'Full Body',
    bodyGroup: 'Full Body',
    secondaryRegions: ['Quads & Hip Flexors', 'Shoulders & Arms', 'Gluteus Maximus'],
    equipment: 'Dumbbell',
    description: 'High-intensity compound combining a front squat with an explosive overhead press.',
    setupInstructions: [
      'Hold dumbbells at shoulder level, feet shoulder-width apart.'
    ],
    techniqueCues: [
      'Squat down into full depth.',
      'Explode up through legs, transferring power directly into pressing dumbbells overhead.'
    ],
    commonMistakes: [
      'Pausing at the top of squat before pressing.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell / Dumbbell Swing',
    category: 'Full Body Conditioning',
    targetRegion: 'Full Body',
    bodyGroup: 'Full Body',
    secondaryRegions: ['Gluteus Maximus', 'Hamstrings & Tie-in'],
    equipment: 'Kettlebell',
    description: 'Dynamic power hinge burning calories while strengthening posterior chain and core stamina.',
    setupInstructions: [
      'Stand over bell with wide stance. Hinge back to grab handle with both hands.'
    ],
    techniqueCues: [
      'Hike bell back between thighs, then snap hips forward aggressively.',
      'Float bell up to chest height using hip drive, not arms.'
    ],
    commonMistakes: [
      'Squatting instead of hinging at hips.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },

  // ADDITIONAL NON-GLUTE EXERCISES: LEGS
  {
    id: 'barbell-rdl-hamstrings',
    name: 'Barbell Romanian Deadlift (RDL)',
    category: 'Legs Isolation',
    targetRegion: 'Hamstrings & Tie-in',
    bodyGroup: 'Legs',
    secondaryRegions: ['Gluteus Maximus', 'Back & Lats'],
    equipment: 'Barbell',
    description: 'Heavy posterior chain hinge builder targeting hamstring tension under stretch with a rigid torso.',
    setupInstructions: [
      'Hold barbell with overhand grip at hip height, soft bend in knees.',
      'Keep shoulder blades pulled back and spine flat.'
    ],
    techniqueCues: [
      'Hinge hips straight backwards as bar slides down close to thighs.',
      'Stop when hips reach max backward stretch, then drive hips forward to stand.'
    ],
    commonMistakes: [
      'Rounding lower spine at bottom.',
      'Bending knees into a conventional squat position.'
    ],
    biomechanicsType: 'Stretch Position',
    difficulty: 'Intermediate'
  },
  {
    id: 'hack-squat-machine',
    name: 'Hack Squat Machine',
    category: 'Legs Isolation',
    targetRegion: 'Quads & Hip Flexors',
    bodyGroup: 'Legs',
    secondaryRegions: ['Gluteus Maximus', 'Legs & Calves'],
    equipment: 'Machine',
    description: 'Fixed-track machine squat allowing maximum knee flexion and quad hypertrophy with full back support.',
    setupInstructions: [
      'Place shoulders firmly under pads with feet shoulder-width in middle of sled.',
      'Disengage safety handles while keeping knees unlocked.'
    ],
    techniqueCues: [
      'Descend into a deep knee bend until thighs pass parallel.',
      'Drive upwards through heels and mid-foot to press sled back up.'
    ],
    commonMistakes: [
      'Heels lifting off footplate at deep knee flexion.',
      'Allowing knees to cave inward.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },
  {
    id: 'goblet-squat-dumbbell',
    name: 'Dumbbell / Kettlebell Goblet Squat',
    category: 'Legs Isolation',
    targetRegion: 'Quads & Hip Flexors',
    bodyGroup: 'Legs',
    secondaryRegions: ['Gluteus Maximus'],
    equipment: 'Dumbbell',
    description: 'User-friendly quad builder and squat pattern teacher holding a single weight against chest.',
    setupInstructions: [
      'Hold dumbbell vertically against chest with palms supporting upper bell.',
      'Stand with feet shoulder-width apart, toes slightly flared.'
    ],
    techniqueCues: [
      'Sit hips down between ankles while keeping elbows tucked inside knees at bottom.',
      'Push floor away evenly to return upright.'
    ],
    commonMistakes: [
      'Rounding upper spine forward under dumbbell weight.',
      'Knees collapsing inward.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Beginner'
  },

  // ADDITIONAL NON-GLUTE EXERCISES: CHEST
  {
    id: 'flat-dumbbell-bench-press',
    name: 'Flat Dumbbell Bench Press',
    category: 'Upper Push',
    targetRegion: 'Chest',
    bodyGroup: 'Chest',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Dumbbell',
    description: 'Classic horizontal press allowing full deep chest stretch and natural convergent wrist movement.',
    setupInstructions: [
      'Sit on flat bench with dumbbells on thighs. Kick dumbbells up as you lie back.',
      'Plant feet firmly into floor with light natural arch in back.'
    ],
    techniqueCues: [
      'Press dumbbells up in a smooth arc until thumbs gently touch overhead.',
      'Lower under control until dumbbells reach outer chest level.'
    ],
    commonMistakes: [
      'Flaring elbows out to 90 degrees.',
      'Bouncing dumbbells together forcefully at top.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Beginner'
  },
  {
    id: 'incline-barbell-press',
    name: 'Incline Barbell Bench Press',
    category: 'Upper Push',
    targetRegion: 'Chest',
    bodyGroup: 'Chest',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Barbell',
    description: 'Heavy upper clavicular chest loader building shoulder press strength and chest thickness.',
    setupInstructions: [
      'Set bench to 30-degree incline, grip barbell shoulder-width apart.',
      'Unrack bar over upper chest with shoulder blades retracted.'
    ],
    techniqueCues: [
      'Lower bar slowly to upper sternum just below collarbones.',
      'Drive bar straight up in a vertical path to lockout.'
    ],
    commonMistakes: [
      'Setting bench angle higher than 45 degrees.',
      'Flaring elbows wide.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Intermediate'
  },
  {
    id: 'chest-dips',
    name: 'Parallel Bar Chest Dips',
    category: 'Upper Push',
    targetRegion: 'Chest',
    bodyGroup: 'Chest',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Bodyweight',
    description: 'Bodyweight compound power movement loading lower/mid chest fibers and triceps under deep stretch.',
    setupInstructions: [
      'Grip parallel bars and jump up to lockout with arms straight.',
      'Lean torso forward slightly with knees bent or crossed behind.'
    ],
    techniqueCues: [
      'Lower body by bending elbows until upper arms are parallel to floor.',
      'Press floor/bars away to push back to lockout.'
    ],
    commonMistakes: [
      'Staying too upright (shifts load entirely to triceps).',
      'Going too deep causing shoulder joint strain.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },

  // ADDITIONAL NON-GLUTE EXERCISES: BACK
  {
    id: 'pullup-bodyweight',
    name: 'Bodyweight / Band Pull-Up',
    category: 'Upper Pull',
    targetRegion: 'Back & Lats',
    bodyGroup: 'Back',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Bodyweight',
    description: 'Gold standard vertical pulling exercise for building back width, lat strength, and arm control.',
    setupInstructions: [
      'Grip pull-up bar overhand slightly wider than shoulder width.',
      'Hang with full arm extension and core engaged.'
    ],
    techniqueCues: [
      'Pull chest up toward bar by driving elbows down into side ribs.',
      'Lower under control to full arm hang stretch.'
    ],
    commonMistakes: [
      'Kicking legs or swinging hips for momentum.',
      'Cutting bottom range of motion short.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Intermediate'
  },
  {
    id: 'face-pull-cable',
    name: 'Cable Rear Delt Face Pull',
    category: 'Upper Pull',
    targetRegion: 'Back & Lats',
    bodyGroup: 'Back',
    secondaryRegions: ['Shoulders & Arms'],
    equipment: 'Cable',
    description: 'Essential upper back & rear delt posture exercise that strengthens external rotators and scapular health.',
    setupInstructions: [
      'Attach rope to cable pulley set at eye level.',
      'Grip rope ends with thumbs pointing backwards.'
    ],
    techniqueCues: [
      'Pull rope toward face, separating rope ends toward ears as elbows drive back.',
      'Squeeze upper back and rear shoulders for 1 second.'
    ],
    commonMistakes: [
      'Using ego weight and leaning torso back.',
      'Pulling down to stomach instead of face level.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },

  // ADDITIONAL NON-GLUTE EXERCISES: SHOULDERS & ARMS
  {
    id: 'overhead-barbell-press',
    name: 'Standing Barbell Overhead Press (OHP)',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    secondaryRegions: ['Chest'],
    equipment: 'Barbell',
    description: 'Fundamental upper-body overhead pressing compound building anterior delts, triceps, and core stability.',
    setupInstructions: [
      'Rest barbell across front shoulders/clavicles with overhand grip just outside shoulders.',
      'Brace glutes and abs tightly to lock pelvis.'
    ],
    techniqueCues: [
      'Tilt head back slightly as bar clears chin, then press straight overhead.',
      'Push head forward through the window at top lockout.'
    ],
    commonMistakes: [
      'Excessive lower back arching.',
      'Pressing bar far forward in front of body center.'
    ],
    biomechanicsType: 'Push/Pull',
    difficulty: 'Intermediate'
  },
  {
    id: 'incline-dumbbell-bicep-curl',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    equipment: 'Dumbbell',
    description: 'Places bicep long head under maximum stretch in shoulder extension for complete bicep development.',
    setupInstructions: [
      'Sit on bench set to 45-60 degree incline.',
      'Let arms hang straight down behind torso holding dumbbells.'
    ],
    techniqueCues: [
      'Curl dumbbells up smoothly while keeping upper arms motionless.',
      'Supinate wrists at top (palms facing ceiling) and squeeze bicep.'
    ],
    commonMistakes: [
      'Swinging shoulders forward to cheat lift.',
      'Lifting torso off bench.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'cable-hammer-curl',
    name: 'Rope Cable Hammer Curl',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    equipment: 'Cable',
    description: 'Targets brachialis and brachioradialis for forearm thickness and upper arm density.',
    setupInstructions: [
      'Attach rope to low cable pulley.',
      'Grip rope ends with neutral grip (palms facing each other).'
    ],
    techniqueCues: [
      'Curl rope up toward chest while keeping elbows pinned to sides.',
      'Lower down slowly against constant cable tension.'
    ],
    commonMistakes: [
      'Swinging upper body backwards.',
      'Flaring elbows out.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'skull-crushers-ez-bar',
    name: 'Lying EZ-Bar Skull Crushers',
    category: 'Arms & Shoulders',
    targetRegion: 'Shoulders & Arms',
    bodyGroup: 'Arms',
    equipment: 'Barbell',
    description: 'Direct tricep long-head builder extending elbows from a stretched overhead/lying position.',
    setupInstructions: [
      'Lie back on flat bench holding EZ-curl bar directly over chest with narrow grip.'
    ],
    techniqueCues: [
      'Bend elbows to lower bar toward forehead or slightly behind top of head.',
      'Extend elbows back up to lock out triceps.'
    ],
    commonMistakes: [
      'Flaring elbows wide to sides.',
      'Moving upper arms back and forth wildly.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Intermediate'
  },

  // ADDITIONAL NON-GLUTE EXERCISES: ABS & CORE
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Knee / Leg Raise',
    category: 'Core & Stability',
    targetRegion: 'Abs & Core',
    bodyGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'Powerful abdominal & hip flexor exercise focusing on pelvic tilt and lower abs.',
    setupInstructions: [
      'Hang from pull-up bar with overhand grip and legs relaxed.'
    ],
    techniqueCues: [
      'Curl pelvis up and lift knees or straight legs toward chest level.',
      'Lower legs under control without swinging back and forth.'
    ],
    commonMistakes: [
      'Swinging body wildly to swing legs up.',
      'Arching lower back on descent.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },
  {
    id: 'cable-ab-crunch',
    name: 'Kneeling Cable Ab Crunch',
    category: 'Core & Stability',
    targetRegion: 'Abs & Core',
    bodyGroup: 'Core',
    equipment: 'Cable',
    description: 'Direct progressive overload exercise for rectus abdominis using constant cable tension.',
    setupInstructions: [
      'Kneel facing cable stack holding rope attachment behind head/neck.',
      'Hips anchored in fixed position.'
    ],
    techniqueCues: [
      'Flex spine forward, curling ribcage down toward pelvis.',
      'Squeeze abs hard at bottom before unrolling under control.'
    ],
    commonMistakes: [
      'Sitting back onto heels instead of flexing spine.',
      'Pulling rope down with arm power.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  },
  {
    id: 'plank-hold',
    name: 'Plank Hold',
    category: 'Core & Stability',
    targetRegion: 'Abs & Core',
    bodyGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'Isometric anti-extension exercise building deep core bracing and total-body midline stability.',
    setupInstructions: [
      'Forearms and toes on the floor, elbows stacked under shoulders, body in one straight line.'
    ],
    techniqueCues: [
      'Brace abs and glutes hard, keep hips level with the shoulders.',
      'Breathe steadily without letting hips sag or pike.'
    ],
    commonMistakes: [
      'Letting hips sag toward the floor.',
      'Piking hips up to relieve core tension.'
    ],
    biomechanicsType: 'Activation',
    difficulty: 'Beginner'
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'Core & Stability',
    targetRegion: 'Abs & Core',
    bodyGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'Anti-extension core control drill that trains the abs to resist lower back arching during limb movement.',
    setupInstructions: [
      'Lie on back, arms reaching straight up, knees bent 90° over the hips.'
    ],
    techniqueCues: [
      'Press the low back flat into the floor throughout.',
      'Slowly extend the opposite arm and leg without letting the back arch.'
    ],
    commonMistakes: [
      'Letting the lower back lift off the floor.',
      'Moving too fast and losing control.'
    ],
    biomechanicsType: 'Activation',
    difficulty: 'Beginner'
  },
  {
    id: 'weighted-decline-situp',
    name: 'Weighted Decline Sit-Up',
    category: 'Core & Stability',
    targetRegion: 'Abs & Core',
    bodyGroup: 'Core',
    equipment: 'Dumbbell',
    description: 'Loaded spinal flexion movement on a decline bench for progressive overload of the rectus abdominis.',
    setupInstructions: [
      'Secure feet on a decline bench, hold a dumbbell at the chest with both hands.'
    ],
    techniqueCues: [
      'Curl the spine up vertebra by vertebra rather than yanking through the hips.',
      'Lower back down under control to a full stretch.'
    ],
    commonMistakes: [
      'Using hip flexors to fling the torso up.',
      'Pulling on the neck with the arms.'
    ],
    biomechanicsType: 'Compound',
    difficulty: 'Intermediate'
  },
  {
    id: 'cable-woodchop',
    name: 'Cable Woodchop',
    category: 'Core & Stability',
    targetRegion: 'Abs & Core',
    bodyGroup: 'Core',
    equipment: 'Cable',
    description: 'Rotational core exercise training the obliques to control force through a diagonal chop pattern.',
    setupInstructions: [
      'Set the cable at a high position, stand side-on to the stack holding the handle with both hands.'
    ],
    techniqueCues: [
      'Rotate through the torso and hips, pulling the handle down and across the body.',
      'Keep arms relatively straight and let the core drive the motion.'
    ],
    commonMistakes: [
      'Only moving the arms instead of rotating the torso.',
      'Using momentum instead of controlled rotation.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Intermediate'
  },
  {
    id: 'kettlebell-russian-twist',
    name: 'Kettlebell Russian Twist',
    category: 'Core & Stability',
    targetRegion: 'Abs & Core',
    bodyGroup: 'Core',
    equipment: 'Kettlebell',
    description: 'Seated rotational movement targeting the obliques through controlled side-to-side torso rotation.',
    setupInstructions: [
      'Sit with knees bent, torso leaned back roughly 45°, holding a kettlebell at the chest.'
    ],
    techniqueCues: [
      'Rotate the torso to tap the kettlebell on the floor beside each hip.',
      'Keep the chest up and move from the ribcage, not just the arms.'
    ],
    commonMistakes: [
      'Rounding the lower back excessively.',
      'Rushing reps and losing rotational control.'
    ],
    biomechanicsType: 'Isolation',
    difficulty: 'Beginner'
  }
];

