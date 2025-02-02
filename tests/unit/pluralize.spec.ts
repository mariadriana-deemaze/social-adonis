import { pluralize } from '#utils/pluralize'
import { test } from '@japa/runner'

test.group('Pluralize', () => {
  test('Should return "reply" when count is equal to 1', async ({ assert }) => {
    const word = pluralize('reply', 1)
    assert.equal(word, 'reply')
  })

  test('Should return "replies" when count is above 1', async ({ assert }) => {
    const word = pluralize('reply', 2)
    assert.equal(word, 'replies')
  })

  test('Should return "comment" when count is equal to 1', async ({ assert }) => {
    const word = pluralize('comment', 1)
    assert.equal(word, 'comment')
  })

  test('Should return "comments" when count is above 1', async ({ assert }) => {
    const word = pluralize('comment', 2)
    assert.equal(word, 'comments')
  })

  test('Should return "carrot" when count is equal to 1', async ({ assert }) => {
    const word = pluralize('carrot', 1)
    assert.equal(word, 'carrot')
  })

  test('Should return "carrots" when count is above 1', async ({ assert }) => {
    const word = pluralize('carrot', 2)
    assert.equal(word, 'carrots')
  })

  test('Should return "potato" when count is equal to 1', async ({ assert }) => {
    const word = pluralize('potato', 1)
    assert.equal(word, 'potato')
  })

  test('Should return "potatoes" when count is above 1', async ({ assert }) => {
    const word = pluralize('potato', 2)
    assert.equal(word, 'potatoes')
  })
})
