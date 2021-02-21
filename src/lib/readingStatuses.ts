export interface ReadingStatuses {
  notReadYet: string;
  currentlyReading: string;
  read: string;
  stoppedReading: string;
  takingABreak: string;
}

const readingStatuses: ReadingStatuses = {
  notReadYet: 'Not Read Yet',
  currentlyReading: 'Currently Reading',
  read: 'Read',
  stoppedReading: 'Stopped Reading',
  takingABreak: 'Taking a Break',
};

export default readingStatuses;
