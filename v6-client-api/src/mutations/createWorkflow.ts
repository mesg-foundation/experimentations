import { Workflow } from "../models";
import { pubsub } from "../pubsub"

export default async (_, { workflow }) => {
  const createdWorkflow = await Workflow.create(workflow)
  pubsub.publish('WorkflowCreated', { workflow: createdWorkflow })
  return createdWorkflow
}
