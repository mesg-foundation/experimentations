interface IWorkflow {
  id: string
  disabledAt?: Date
}

const workflows: IWorkflow[] = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
]

const all = async () => workflows
  .filter(x => !x.disabledAt)

const find = async (id: String) =>
  workflows.find(x => x.id === id)

const create = async (workflow: IWorkflow) => {
  workflows.push(workflow)
  return workflow
}

const disable = async (id: String) => {
  const workflow = await find(id)
  workflow.disabledAt = new Date()
  return workflow
}

export default {
  all,
  find,
  create,
  disable
}