export const PHASES = [
  {
    key: 'prep',
    name: 'Before',
    blurb: 'Set the compass before you leave the shore. Intention, context, and honesty about the day.',
    questions: [
      'What am I carrying into this? Anticipation, fear, a knot somewhere, a faint hope?',
      'What do I actually want from this time, if anything?',
      'Have I eaten, slept, and made the room at least a little kind to be in?',
      'What would I want a friend to tell me before I go in?',
      'What am I prepared to let happen that I was not prepared for?',
    ],
  },
  {
    key: 'during',
    name: 'In the deep',
    blurb: 'You are not navigating when you are in it. This is just an anchor to loop back to when the current moves.',
    questions: [
      'May I stay with whatever is here a little longer instead of reaching for the next thought?',
      'Is this tightness mine, or am I inside a wave?',
      'What is the body saying that the mind just translated?',
      'Nothing has to be understood right now. Can I let the unresolved simply burn in?',
      'I am allowed to make no new meaning tonight. That is effort too.',
    ],
  },
  {
    key: 'shore',
    name: 'After',
    blurb: 'Coming back through the breakers. Write while damp before the day dries you.',
    questions: [
      'What did I meet that I did not expect to meet?',
      'Which moments felt real, in the unmistakable way?',
      'What wants to be said to the self that goes back out into ordinary life?',
      'What am I grateful for, with no insistence that you have earned it?',
      'If the seer and the seen are one shape, what tiny thing am I going to do with that?',
    ],
  },
]

export const DECK = [
  {
    id: 'p1',
    prompt:
      'Every definition is only a long way of pointing. What have you been pointing at with one word, afraid to paint the whole sentence?',
  },
  {
    id: 'p2',
    prompt:
      'You once drilled down through words and found no bottom. The bottom was never the point — what did you find instead on the way down?',
  },
  {
    id: 'p3',
    prompt:
      'The map is not the water. Where in your days have you been pouring all your faith into the map?',
  },
  {
    id: 'p4',
    prompt:
      'Tell the truth about the last pleasure that did not survive being thought about. What was real in it that the thought could not touch?',
  },
  {
    id: 'p5',
    prompt:
      'Who are you when no sentence about yourself is permitted to begin "I am"?',
  },
  {
    id: 'p6',
    prompt:
      'The fingertips know the fire without a thermometer. What do you know this way, without the instrument?',
  },
  {
    id: 'p7',
    prompt:
      'Somewhere a version of you was frightened of the void. Write a letter to that one, from the shore.',
  },
  {
    id: 'p8',
    prompt:
      'Scientists measure the rooms. Somewhere a child measures the light. Which measurement are you living by and when did you choose it?',
  },
  {
    id: 'p9',
    prompt:
      'The cave painter also believed the sun was a god. Have you ever needed the cave to be wrong for the sun to be real?',
  },
  {
    id: 'p10',
    prompt:
      'Name a wound that taught you into a bigger room. What did it set you free from despite the cost?',
  },
  {
    id: 'p11',
    prompt:
      'The sky has no gratitude and gives everything. Where has your meaning been hiding behind expectations of a return?',
  },
  {
    id: 'p12',
    prompt:
      'Between the thing and its name there is one breath of space. Spend a paragraph finding the floor of that gap.',
  },
  {
    id: 'p13',
    prompt:
      'What is the loneliest sentence you have ever believed? Add a second sentence to it, from now, without mercy and without apologizing.',
  },
  {
    id: 'p14',
    prompt:
      'Give advice to the sea. Then take it back as it was always about you.',
  },
  {
    id: 'p15',
    prompt:
      'When death posted, relief acts. What did you relieve this week without thanks?',
  },
  {
    id: 'p16',
    prompt:
      'Write a small prayer to the you of ten years ago. No foot. No ending heels.',
  },
  {
    id: 'p17',
    prompt:
      'The shadow of a thing is not smaller than the thing. What shadow of yours is actually full-size in ordinary daylight?',
  },
  {
    id: 'p18',
    prompt:
      'If pleasure is a mirage, the hand reaching for it is still your hand. What does it matter, name the hand a treasure you already hold.',
  },
  {
    id: 'p19',
    prompt:
      'A river never argues with the rock about whether it exists. What are you still arguing about that existence cannot lose?',
  },
  {
    id: 'p20',
    prompt:
      'Read the last line you wrote. Now underline the sentence that is actually about you and talk to it like a person.',
  },
]

export function randomDeck(n = 1) {
  const shuffled = [...DECK].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}