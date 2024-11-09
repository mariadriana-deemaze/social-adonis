import { UserFactory } from '#database/factories/user_factory'
import Post from '#models/post'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('Posts content parsing', () => {
  const link = 'https://www.youtube.com/watch?v=jEeQC6I8nlY'
  const contentWithLink = faker.lorem.sentence() + ' ' + link

  const contentWithScript = "<body onload=alert('test1')>"

  test('Sucessfully parses the post content on create', async ({ assert }) => {
    const user = await UserFactory.create()

    const postWithScript = await Post.create({
      userId: user.id,
      content: contentWithScript,
    })

    const postWithLink = await Post.create({
      userId: user.id,
      content: contentWithLink,
    })

    assert.equal(postWithScript.content, "&lt;body onload=alert('test1')&gt;")
    assert.equal(postWithLink.content, contentWithLink)
    assert.equal(postWithLink.link, link)
  })

  test('Sucessfully parses the post content on update', async ({ assert }) => {
    const user = await UserFactory.create()

    const postWithScript = await Post.create({
      userId: user.id,
      content: faker.lorem.sentence(),
    })

    const postWithLink = await Post.create({
      userId: user.id,
      content: faker.lorem.sentence(),
    })

    postWithScript.content = contentWithScript

    postWithLink.content = contentWithLink

    await postWithScript.save()
    await postWithLink.save()

    assert.equal(postWithScript.content, "&amp;lt;body onload=alert('test1')&amp;gt;")
    assert.equal(postWithLink.content, contentWithLink)
    assert.equal(postWithLink.link, link)
  })
})
