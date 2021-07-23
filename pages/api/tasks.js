// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.statusCode = 200
  res.json([
    {
      description: 'Hello world this is a test task',
      priority: 0,
      status: 'in-progress',
      id: 1,
    },
  ])
}
