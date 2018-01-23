import { Workflow } from "../../models";

const workflow = async (_, { id }) => Workflow.find(id)
const allWorkflows = async () => Workflow.all()

export default {
  workflow,
  allWorkflows
}