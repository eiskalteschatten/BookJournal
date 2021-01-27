export interface NunjucksRenderObject {
  id: string;
  classes: string;
  iconPath: string;
  displayName: string;
  type: string;
  dataFields?: {
    'query-type': string;
  };
}
