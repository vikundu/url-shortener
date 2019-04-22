const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context, info) {

    // if each link should come from a authenticated user
    // const userId = getUserId(context)

    return context.prisma.createLink({
      url: args.url,
      shortUrl: args.shortUrl,
    })
  }

  function analytic(parent, args, context, info) {

    console.log(args.url)
    return context.prisma.upsertAnalytic({
        where: {
            ipUrl: args.ipUrl
        },
        update: {
            clickCount: args.clickCount
        },
        create: {
            url: args.url,
            ipUrl: args.ipUrl,
            clickCount: 1,
        }
    })
  }

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({...args, password})
   
    const token = jwt.sign({ userId: user.id}, APP_SECRET)

    return {
        token,
        user
    }
}

async function login(parent, args, context, info) {

    const user = await context.prisma.user({ email: args.email })

    if(!user) {
        throw new Error('User not found')
    }

    const valid = await bcrypt.compare(args.password, user.password)

    if(!valid) {
        throw new Error('Wrong password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user
    }
}

module.exports = {
    signup,
    login,
    post,
    analytic
}