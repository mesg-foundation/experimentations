import { pubsub } from "../pubsub"

export default {
  subscribe: (parent, args) => pubsub.asyncIterator('WorkflowCreated')
}