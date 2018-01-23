import { pubsub } from "../pubsub"

export default (parent, args) => pubsub.asyncIterator('WorkflowCreated')