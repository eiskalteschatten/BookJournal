import Theme from './interface';

const dark: Theme = {
  mainBg: '#222222',
  mainFontColor: '#e0e0e0',

  linkColor: '#019CEE',
  boxShadowColor: 'darken($mainBg, 50%)',

  sidebarBg: '#000000',
  sidebarColor: '$mainFontColor',
  middleColumnBg: 'lighten($mainBg, 1%)',

  listHoverBg: 'lighten($sidebarBg, 5%)',
  listSelectedBg: '#063353',
  listSelectedDarkBg: '$listSelectedBg',
  listBorderColor: 'darken($mainBg, 3%)',

  searchFormBackgroundImage: '../assets/images/search.svg',
  searchFormBg: '#000000',
  searchFormColor: '#ffffff',
  searchFormBorderColor: 'lighten($searchFormBg, 15%)',
  searchFormHoverBg: 'lighten($searchFormBg, 5%)',
  searchFormFocusBg: 'lighten($searchFormBg, 3%)',

  formBg: 'lighten($mainBg, 7%)',
  formColor: '$mainFontColor',
  buttonBg: 'lighten($mainBg, 7%)',
  buttonColor: '$mainFontColor',
  buttonHoverBg: 'darken($buttonBg, 2%)',
  buttonActiveBg: 'darken($buttonBg, 10%)',
  buttonSelectedBg: 'darken($buttonBg, 7%)',
  selectionBarSelectorBorderColor: 'darken($buttonBg, 10%)',

  toolbarButtonColor: '$mainFontColor',
  toolbarIconPlus: '../assets/images/dark/si-glyph-button-plus.svg',
  toolbarIconSidebarPlus: '$toolbarIconPlus',

  modalContainerBg: 'rgba(2, 2, 2, .5)',
  modalCloseX: '../assets/images/dark/modal-close-x.svg',
  modalHeaderBorderColor: 'darken($mainFontColor, 70%)',

  booksByAuthorHoverBg: 'lighten($mainBg, 2%)',
  booksByAuthorReadStatusColor: '#01D75E',

  preferencesThemeBorderColor: '#000000',
  preferencesThemeSelectedBorderColor: 'lighten($listSelectedBg, 20%)',
  preferencesThemeShadowColor: 'rgba(0, 0, 0, 0.8)',

  noBookSelected: '../assets/images/dark/icon-monotone.svg',

  gear: '../assets/images/dark/gear.svg',

  sortBg: '$middleColumnBg',
  sortColor: '$mainFontColor',

  bookcoverListPlaceholder: '../assets/images/dark/bookcover.svg',
  bookListHoverBg: 'lighten($middleColumnBg, 1%)',

  bookcoverUploadArea: '$bookcoverListPlaceholder',
  uploadAreaBorderColor: '#333333',
  uploadAreaDragoverBg: '#333333',

  colorCircleBorderColor: '#333333',
  colorCircleLightBorderColor: '$colorCircleBorderColor',

  bookFormGroupBorderColor: '#333333',

  badgeBg: 'lighten($mainBg, 5%)',
  badgeHoverBg: 'lighten($badgeBg, 2%)',
  tagBadgeBg: '#610115',
  tagBadgeHoverBg: 'lighten($tagBadgeBg, 2%)',
  tagBadgeColor: '$mainFontColor',
  removeBadge: '../assets/images/dark/si-glyph-circle-remove.svg',
  removeBadgeDarkFg: '$removeBadge',

  ratingStarsFull: '../assets/images/dark/star.svg',
  ratingStarsEmpty: '../assets/images/dark/star-empty.svg',
  ratingStarsRemove: '../assets/images/si-glyph-trash.svg',

  statisticsCellBorderColor: 'darken($mainFontColor, 50%)',

  toggleSwitchBg: 'darken($mainBg, 15%)',
  toggleSwitchKnobBg: '#565656',
  toggleSwitchBorder: 'darken($selectionBarSelectorBorderColor, 15%)',
  toggleSwitchCheckedBg: '#01476d',
  toggleSwitchCheckedBorder: '#071f2c'
};

export default dark;
