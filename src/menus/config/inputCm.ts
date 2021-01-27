import { MenuItemConstructorOptions } from 'electron';

const template: MenuItemConstructorOptions[] = [
  { role: 'cut' },
  { role: 'copy' },
  { role: 'paste' },
];

if (process.platform === 'darwin') {
  template.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startSpeaking' },
        { role: 'stopSpeaking' },
      ],
    }
  );
}

export default template;
