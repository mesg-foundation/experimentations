import { Workflow } from "../../models";
import { pubsub } from "../../pubsub"

const createWorkflow = async (_, { workflow }) => {
  const createdWorkflow = await Workflow.create(workflow)
  pubsub.publish('WorkflowCreated', { workflow: createdWorkflow })
  return createdWorkflow
}

const deleteWorkflow = async (_, { id }) => Workflow.disable(id)

export default {
  createWorkflow,
  deleteWorkflow
}