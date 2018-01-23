import { pubsub } from "../../pubsub"

const workflow = {
  subscribe: () => pubsub.asyncIterator('WorkflowCreated')
}

export default {
  workflow
}