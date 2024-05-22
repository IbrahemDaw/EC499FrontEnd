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
        showValue: 'User'
      },
      {
        to: '/roleTable',
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
        showValue: 'Tag',
        label: 'Tags',
        icon: mdiCodeTags
      },
      {
        to: '/categories',
        showValue: 'Category',
        label: 'Categories',
        icon: mdiFormatListGroup
      },
      {
        to: '/documents',
        showValue: 'Document',
        label: 'Documents',
        icon: mdiFileDocument
      },
      {
        to: '/gradustion',
        showValue: 'GradustionProject',
        label: 'GraduationProject',
        icon: mdiFileDocument
      }
    ]
  }
]
