import { Workflow } from "../models";

export default async (_, { id }) => Workflow.find(id)
