export function getGasProperty(name: string): string {
  return PropertiesService.getScriptProperties().getProperty(name);
}
