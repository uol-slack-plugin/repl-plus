import { DatastoreItem } from "deno-slack-api/types.ts";
import ModulesDatastore from "../datastores/modules_datastore.ts";

export class Module {
  id: string;
  code: string;
  name: string;

  constructor(id: string, code: string, name: string) {
    this.id = id;
    this.code = code;
    this.name = name;
  }

  public static constructModulesFromDatastore(
    modulesDatastore: DatastoreItem<typeof ModulesDatastore.definition>[],
  ): Module[] {
    const modules: Module[] = [];

    modulesDatastore.forEach((moduleItem) => {
      modules.push(
        new Module(
          moduleItem.id,
          moduleItem.code,
          moduleItem.name,
        ),
      );
    });
    return modules;
  }

  public static constructModulesFromJson(modulesJson: string): Module[] {
    const modules: Module[] = [];

    try {
      // deno-lint-ignore no-explicit-any
      const moduleObjects: any[] = JSON.parse(modulesJson);

      if (!Array.isArray(moduleObjects)) {
        throw new Error('Invalid JSON format: Expected an array.');
      }

      moduleObjects.forEach((moduleItem) => {
        if (
          typeof moduleItem.id === 'string' &&
          typeof moduleItem.code === 'string' &&
          typeof moduleItem.name === 'string'
        ) {
          modules.push(new Module(moduleItem.id, moduleItem.code, moduleItem.name));
        } else {
          console.warn('Invalid module data:', moduleItem);
        }
      });
    } catch (error) {
      console.error('Error parsing or constructing modules from JSON:', error);
    }

    return modules;
  }
};