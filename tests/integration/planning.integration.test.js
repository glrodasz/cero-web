// import { Selector } from 'testcafe'

fixture`Planning Testing`.page`http://localhost:3000/planning`

test('when a new task is added it should send a POST request', async (t) => {
  await t
    .click('#planning-add-button')
    .typeText('#planning-add-button-input', 'John Smith')
})
