// Seed for the `fixtures` data source, which `.env.test` selects for the
// TestCafe integration run. Fixed data, unlike the other data sources, so
// integration tests get the same state on every run.
const tasks = [
  {
    description:
      "Crevice returns knocking sleeping Thranduil venture enters roll. Sisters Luin relative wax country wished pouf travel they've self moonlight fashioning.",
    priority: 0,
    status: 'in-progress',
    id: 2,
  },
  {
    description:
      "One Ring to rule them all. Foreign paid pushing hair strength's regurgitation hot Isildur's manage torches slightest",
    priority: 1,
    status: 'in-progress',
    id: 32,
  },
  {
    description:
      "One Ring to rule them all. Foreign paid pushing hair strength's regurgitation hot Isildur's manage torches slightest",
    priority: 2,
    status: 'in-progress',
    id: 33,
  },
  {
    description:
      'Done possess candles hairy heir rune odds 30 Caradhras crispy swish labyrinth?',
    priority: 3,
    status: 'pending',
    id: 5,
  },
  {
    description:
      'Done possess candles hairy heir rune odds 30 Caradhras crispy swish labyrinth?',
    priority: 4,
    status: 'pending',
    id: 6,
  },
  {
    description:
      'Done possess candles hairy heir rune odds 30 Caradhras crispy swish labyrinth?',
    priority: 5,
    status: 'pending',
    id: 7,
  },
  {
    description: "Pity's wheel King's. Nazgûl butter youngest report.",
    priority: 6,
    status: 'completed',
    id: 1,
  },
]

export default tasks
