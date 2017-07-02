// @flow

const spawn = require('..')

function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

function asyncQuery(queryDef) {
  spawn(async function() {
    await sleep(2000)
    main.send(`${queryDef} result`)
  })
}

const main = spawn(async function() {
  const queries = take(5)
    .map(i => asyncQuery(`query ${i}`))
    .map(() => () => main.receive(a => a))

  const results = await all(queries)
  console.log(results)
})

function* numbers(max) {
  let n = 1
  while (n <= max) yield n++
}

function take(n) {
  const results = []
  for (const num of numbers(n)) results.push(num)
  return results
}

async function all(funcs) {
  const results = []
  for (const f of funcs) results.push(await f())
  return results
}