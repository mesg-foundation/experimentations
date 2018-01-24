const workflows = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
]

export default {
  workflow: async (_, { id }) => workflows.find(x => x.id === id),
  allWorkflows: async () => workflows
}