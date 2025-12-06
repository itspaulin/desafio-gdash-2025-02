import { UseCaseError } from "./use-case-error";

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(resource: string = "Recurso") {
    super(`${resource} Não encontrado`);
    this.name = "ResourceNotFoundError";
  }
}
