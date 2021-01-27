export interface NunjucksRenderObject {
  id: number;
  classes: string;
  iconPath: string;
  displayName: string;
  type: string;
  dataFields?: {
    'query-type': string;
  };
  subtitle?: string;
  bookcoverPath?: string;
  color?: string;
}
