export interface ReadingStatuses {
  notReadYet: string;
  currentlyReading: string;
  read: string;
  stoppedReading: string;
  takingABreak: string;
}

export default {
  notReadYet: 'Not Read Yet',
  currentlyReading: 'Currently Reading',
  read: 'Read',
  stoppedReading: 'Stopped Reading',
  takingABreak: 'Taking a Break',
} as ReadingStatuses;
