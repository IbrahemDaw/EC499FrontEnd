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
  mdiCodeTags,
  mdiFormatListGroup
} from '@mdi/js'

export default [
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    to: '/tables',
    label: 'Tables',
    icon: mdiTable
  },
  {
    to: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/responsive',
    label: 'Responsive',
    icon: mdiResponsive
  },
  {
    to: '/',
    label: 'Styles',
    icon: mdiPalette
  },
  {
    label: 'Mangment',
    icon: mdiViewList,
    menu: [
      {
        to: '/userTable',
        label: 'Users',
        icon: mdiTable
      },
      {
        to: '/roleTable',
        label: 'Roles',
        icon: mdiTable
      }
    ]
  },
  {
    label: 'Documentation',
    icon: mdiViewList,
    menu: [
      {
        to: '/tags',
        label: 'Tags',
        icon: mdiCodeTags
      },
      {
        to: '/categories',
        label: 'Categories',
        icon: mdiFormatListGroup
      },{
        to: '/documents',
        label: 'Documents',
        icon: mdiFileDocument
      }
    ]
  }
]
