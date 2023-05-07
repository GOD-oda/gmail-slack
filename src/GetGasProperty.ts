export function getProperty(name: string): string {
  return PropertiesService.getScriptProperties().getProperty(name);
}