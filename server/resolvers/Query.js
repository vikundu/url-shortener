async function feed(parent, args, context, info) {

  const where = args.filter ? {
    OR: [
      { id_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const links = await context.prisma.links({
    where
  })
  
  const count = await context.prisma
    .linksConnection({
      where,
    })
    .aggregate()
    .count()
  
  return {
    links,
    count
  }
  
  }

async function analytic(parent, args, context, info) {

  const analytics = await context.prisma.analytic({
    ipUrl: args.ipUrl,
  })

  return analytics
}

async function analyticsIp(parent, args, context, info){

  const where = args.filter ? {
    OR: [
      { ipUrl_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const data = await context.prisma.analytics({where})

  return data
}

module.exports = {
  feed,
  analytic,
  analyticsIp
}