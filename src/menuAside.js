import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiReact,
  mdiFileDocument,
  mdiAccountGroup,
  mdiCodeTags,
  mdiFormatListGroup
} from '@mdi/js'

export default [
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
    show: true
  },
  {
    label: 'Mangment',
    icon: mdiViewList,
    show: true,
    menu: [
      {
        to: '/userTable',
        label: 'Users',
        icon: mdiAccountGroup,
        showValue: 'User',
        show: JSON.parse(localStorage.getItem('pages')).user
      },
      {
        to: '/roleTable',
        show: JSON.parse(localStorage.getItem('pages')).role,
        label: 'Roles',
        showValue: 'Role',
        icon: mdiAccountGroup
      }
    ]
  },
  {
    label: 'Documentation',
    show: true,
    icon: mdiViewList,
    menu: [
      {
        to: '/tags',
        show: JSON.parse(localStorage.getItem('pages')).tag,
        showValue: 'Tag',
        label: 'Tags',
        icon: mdiCodeTags
      },
      {
        to: '/categories',
        show: JSON.parse(localStorage.getItem('pages')).category,
        label: 'Categories',
        icon: mdiFormatListGroup
      },
      {
        to: '/documents',
        showValue: 'Document',
        show: JSON.parse(localStorage.getItem('pages')).user,
        label: 'Documents',
        icon: mdiFileDocument
      }
    ]
  }
]
