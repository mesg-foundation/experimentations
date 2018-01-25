import { Context } from './utils'
import { Runner, Workflow } from './generated/prisma'

const delegateQuery = query => (parent, args, ctx: Context, info) => ctx.db
  .query[query](args, info)
const delegateMutation = mutation => (parent, args, ctx: Context, info) => ctx.db
  .mutation[mutation](args, info)

const delegate = (mapping, func) => Object.keys(mapping)
  .reduce((acc, x) => ({
    ...acc,
    [x]: func(mapping[x])
  }), {})

export default {
  Query: {
    ...delegate({
      runner: 'runner',
      runners: 'runners',
      workflow: 'workflow',
      workflows: 'workflows',
      service: 'service',
      services: 'services',
    }, delegateQuery),
  },
  
  Mutation: {
    ...delegate({
      deployWorkflow: 'createWorkflow',
      disableWorkflow: 'deleteWorkflow',
      register: 'createRunner',
      unregister: 'deleteRunner',
      createService: 'createService',
    }, delegateMutation),
  }
}