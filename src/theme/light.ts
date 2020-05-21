import Theme from './interface';

const light: Theme = {
  mainBg: '#f0f0f0',
  mainFontColor: '#0e0e0e',

  linkColor: '#019CEE',
  boxShadowColor: 'darken($mainBg, 50%)',

  sidebarBg: '#000000',
  sidebarColor: '#e0e0e0',
  middleColumnBg: 'lighten($mainBg, 1%)',

  listHoverBg: 'lighten($sidebarBg, 5%)',
  listSelectedBg: '#98bbd4',
  listSelectedDarkBg: '#063353',
  listBorderColor: 'darken($mainBg, 3%)',

  searchFormBackgroundImage: '../assets/images/search.svg',
  searchFormBg: '#000000',
  searchFormColor: '#ffffff',
  searchFormBorderColor: 'lighten($searchFormBg, 15%)',
  searchFormHoverBg: 'lighten($searchFormBg, 5%)',
  searchFormFocusBg: 'lighten($searchFormBg, 2%)',

  formBg: 'lighten($mainBg, 7%)',
  formColor: '$mainFontColor',
  buttonBg: 'lighten($mainBg, 7%)',
  buttonColor: '$mainFontColor',
  buttonHoverBg: 'darken($buttonBg, 2%)',
  buttonActiveBg: 'darken($buttonBg, 10%)',
  buttonSelectedBg: 'darken($buttonBg, 7%)',
  selectionBarSelectorBorderColor: 'darken($buttonBg, 10%)',

  toolbarButtonColor: '$mainFontColor',
  toolbarIconPlus: '../assets/images/light/si-glyph-button-plus.svg',
  toolbarIconSidebarPlus: '../assets/images/dark/si-glyph-button-plus.svg',

  modalContainerBg: 'rgba(240, 240, 240, .8)',
  modalCloseX: '../assets/images/light/modal-close-x.svg',
  modalHeaderBorderColor: 'lighten($mainFontColor, 80%)',

  booksByAuthorHoverBg: 'lighten($mainBg, 1%)',
  booksByAuthorReadStatusColor: '#027238',

  preferencesThemeBorderColor: '$mainFontColor',
  preferencesThemeSelectedBorderColor: 'darken($listSelectedBg, 20%)',
  preferencesThemeShadowColor: 'rgba(0, 0, 0, 0.2)',

  sortBg: '$middleColumnBg',
  sortColor: '$mainFontColor',

  noBookSelected: '../assets/images/light/icon-monotone.svg',

  gear: '../assets/images/light/gear.svg',

  bookcoverListPlaceholder: '../assets/images/light/bookcover.svg',
  bookListHoverBg: 'lighten($middleColumnBg, 1%)',

  bookcoverUploadArea: '$bookcoverListPlaceholder',
  uploadAreaBorderColor: '#333333',
  uploadAreaDragoverBg: '#333333',

  colorCircleBorderColor: '#333333',
  colorCircleLightBorderColor: '#dcdcdc',

  bookFormGroupBorderColor: '#dcdcdc',

  badgeBg: 'lighten($mainBg, 5%)',
  badgeHoverBg: 'darken($badgeBg, 10%)',
  tagBadgeBg: '#dc506d',
  tagBadgeHoverBg: 'darken($tagBadgeBg, 10%)',
  tagBadgeColor: '#ffffff',
  removeBadge: '../assets/images/dark/si-glyph-circle-remove.svg',
  removeBadgeDarkFg: '../assets/images/light/si-glyph-circle-remove.svg',

  ratingStarsFull: '../assets/images/light/star.svg',
  ratingStarsEmpty: '../assets/images/light/star-empty.svg',
  ratingStarsRemove: '../assets/images/si-glyph-trash.svg',

  statisticsCellBorderColor: 'lighten($mainFontColor, 70%)',

  toggleSwitchBg: 'darken($mainBg, 15%)',
  toggleSwitchKnobBg: '#ffffff',
  toggleSwitchBorder: 'darken($selectionBarSelectorBorderColor, 15%)',
  toggleSwitchCheckedBg: '#019CEE',
  toggleSwitchCheckedBorder: '#98bbd4'
};

export default light;
