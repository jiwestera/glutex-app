import { MobilityRoutine } from '../types';

export const mobilityRoutines: MobilityRoutine[] = [
  {
    id: 'pre-glute-activation',
    name: 'Essential Pre-Glute Activation & Hip Primer',
    category: 'Pre-Workout Activation',
    durationMinutes: 7,
    description: 'Designed to awaken dormant gluteal fibers, deactivate tight quads/hip flexors, and establish a bulletproof mind-muscle connection before heavy lifting.',
    steps: [
      {
        name: '90/90 Hip Switches',
        durationOrReps: '10 total (5/side)',
        instructions: 'Sit on floor with front knee at 90° and back knee at 90°. Rotate hips smoothly from left to right without using hands if possible.',
        keyBenefit: 'Improves internal and external hip joint rotation mobility.',
        targetArea: 'Hip Capsule & Deep Rotators'
      },
      {
        name: 'Frog Stretch & Rocking',
        durationOrReps: '60 seconds',
        instructions: 'On hands and knees, spread knees wide with inner foot edges flat on mat. Gently rock hips back toward heels.',
        keyBenefit: 'Opens up adductors and relieves inner hip tightness.',
        targetArea: 'Adductors & Pelvic Floor'
      },
      {
        name: 'Half-Kneeling Hip Flexor Deactivation',
        durationOrReps: '45s per leg',
        instructions: 'Kneel on back knee, tuck tailbone under into posterior pelvic tilt, and squeeze back glute tight without leaning forward excessively.',
        keyBenefit: 'Reciprocally inhibits tight hip flexors so glutes can fire fully.',
        targetArea: 'Psoas & Iliacus'
      },
      {
        name: 'Banded Lateral Monster Walks',
        durationOrReps: '15 steps / direction',
        instructions: 'Place resistance band around knees or ankles. Lower into a quarter squat and step side to side maintaining tension.',
        keyBenefit: 'Primes Gluteus Medius for lateral hip stability.',
        targetArea: 'Gluteus Medius & Upper Shelf'
      },
      {
        name: 'Single-Leg Glute Bridge Iso-Hold',
        durationOrReps: '20s hold per leg',
        instructions: 'Lie on back, extend one leg out, and drive working heel down to lock hips at top. Squeeze glute hard.',
        keyBenefit: 'Locks in unilateral neuromuscular activation.',
        targetArea: 'Gluteus Maximus'
      }
    ]
  },
  {
    id: 'deep-hip-flow',
    name: 'Deep Hip Mobility & Pelvic Alignment',
    category: 'Hip Mobility & Flow',
    durationMinutes: 10,
    description: 'A comprehensive flow to restore hip joint health, fix anterior pelvic tilt, and increase depth in squats and lunges.',
    steps: [
      {
        name: 'Cat-Cow with Pelvic Focus',
        durationOrReps: '10 smooth breaths',
        instructions: 'On all fours, exaggerate anterior pelvic tilt on inhale and posterior pelvic tilt on exhale.',
        keyBenefit: 'Restores lumbo-pelvic rhythm and spinal awareness.',
        targetArea: 'Lumbar Spine & Pelvis'
      },
      {
        name: 'World\'s Greatest Stretch into Hamstring Extension',
        durationOrReps: '5 reps per side',
        instructions: 'Lunge forward, place same-side elbow inside front ankle, rotate arm upward to ceiling, then straighten front leg for hamstring stretch.',
        keyBenefit: 'Mobilizes thoracic spine, hip flexors, and hamstrings in one fluid motion.',
        targetArea: 'Full Posterior & Kinetic Chain'
      },
      {
        name: 'Couch Stretch (Quads & Hip Flexors)',
        durationOrReps: '60s per side',
        instructions: 'Place back shin flat against a wall with knee in the corner. Step front foot forward and brace core upright.',
        keyBenefit: 'Deepest quad and psoas release available.',
        targetArea: 'Rectus Femoris & Psoas'
      },
      {
        name: 'Ankle Dorsiflexion Mobilization',
        durationOrReps: '45s per ankle',
        instructions: 'Kneel in half-lunge. Drive knee forward past toes while keeping front heel rooted firmly to floor.',
        keyBenefit: 'Increases ankle angle for deeper glute-loading squats.',
        targetArea: 'Ankle Joint & Calf'
      }
    ]
  },
  {
    id: 'desk-worker-reset',
    name: 'Desk-Worker Glute & Hip Flexor Reset',
    category: 'Deactivation & Release',
    durationMinutes: 6,
    description: 'Quick recovery flow to eliminate "glute amnesia" caused by sitting long hours at a desk.',
    steps: [
      {
        name: 'Standing Hip Extension Iso-Squeeze',
        durationOrReps: '10 x 5s holds per side',
        instructions: 'Stand tall, hold a desk or chair, kick leg slightly back and squeeze glute max as hard as possible for 5 seconds.',
        keyBenefit: 'Re-activates glute neural drive after prolonged sitting.',
        targetArea: 'Gluteus Maximus'
      },
      {
        name: 'Figure-4 Seated Stretch',
        durationOrReps: '60s per side',
        instructions: 'Cross working ankle over opposite knee, sit tall, and hinge torso forward over shin.',
        keyBenefit: 'Releases tight piriformis and deep lateral rotators.',
        targetArea: 'Piriformis & Glute Deep Rotators'
      },
      {
        name: 'Standing Quad & Psoas Reach',
        durationOrReps: '45s per side',
        instructions: 'Grab ankle behind you, tuck pelvis under, and reach opposite arm straight up overhead.',
        keyBenefit: 'Lengthens anterior chain.',
        targetArea: 'Quad & Hip Flexors'
      }
    ]
  },
  {
    id: 'post-workout-cool-down',
    name: 'Post-Workout Glute Decompression & Recovery',
    category: 'Post-Workout Cool Down',
    durationMinutes: 8,
    description: 'Promotes parasympathetic recovery, decreases muscle tightness, and accelerates glute repair post-training.',
    steps: [
      {
        name: 'Pigeon Pose (Glute Length Hold)',
        durationOrReps: '90s per side',
        instructions: 'Place front shin across mat, extend rear leg straight back. Sink hips down and fold forward onto forearms.',
        keyBenefit: 'Stretches glute max under relaxation to jumpstart recovery.',
        targetArea: 'Gluteus Maximus & Medius'
      },
      {
        name: 'Lying Figure-4 Thread the Needle',
        durationOrReps: '60s per side',
        instructions: 'Lie on back, cross ankle over knee, thread hands through thighs and gently pull knee toward chest.',
        keyBenefit: 'Depresses nervous system and gently decompresses hip socket.',
        targetArea: 'Deep Glute Fibers'
      },
      {
        name: 'Legs-Up-The-Wall Passive Reset',
        durationOrReps: '2 minutes',
        instructions: 'Lie flat with hips close to wall and legs extended straight up against wall. Take deep diaphragmatic breaths.',
        keyBenefit: 'Flushes metabolic waste and calms central nervous system.',
        targetArea: 'Full Lower Body & Nervous System'
      }
    ]
  }
];
