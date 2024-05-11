<script setup>
import { computed, ref, onMounted, watch, reactive } from 'vue'
import { get, post, put, del } from '@/services/apiServices'
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiDropbox,
  mdiFaceAgent,
  mdiFormDropdown,
  mdiArrowUpDown,
  mdiArrowDown,
  mdiArrowUp,
  mdiFilter,
  mdiDelete,
  mdiEyePlus,
  mdiApplicationBracesOutline,
  mdiAccountPlus,
  mdiAccountEdit,
  mdiCancel
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import {
  VDataTable,
  VCheckbox,
  VSkeletonLoader,
  VIcon,
  VSelect
} from 'vuetify/lib/components/index.mjs'
import {
  mdiContrastCircle,
  mdiInformation,
  mdiCheckCircle,
  mdiAlert,
  mdiAlertCircle,
  mdiOpenInNew,
  mdiClose,
  mdiReload,
  mdiTrendingUp
} from '@mdi/js'

const columns = [
  { title: 'Full Name', value: 'fullName' },
  { title: 'User Name', value: 'userName' },
  { title: 'Phone Number', value: 'phoneNumber' },
  { title: 'Email', value: 'email' },
  { title: 'Enabled', value: 'isEnabled' },
  { title: 'Actions', key: 'actions' }
]
const selectedUsers = ref([])
const items = ref({})
const isLoading = ref(false)
const showError = ref(false)
const filterModel = ref({
  fullName: null,
  userName: null,
  phoneNumber: null,
  email: null,
  isEnabled: null,
  pageNumber: 1,
  pageSize:30
})
const pageNumber = ref(1)
const getUsersAsync = () => {
  isLoading.value = true
  filterModel.value.pageNumber = pageNumber 
  get('api/User/filter', filterModel.value)
    .then((response) => {
      isLoading.value = false
      showError.value = false
      items.value = response.data
    })
    .catch((e) => {
      isLoading.value = false
      showError.value = true
    })
}
onMounted(() => {
  getUsersAsync()
  getRoles()
})
watch(pageNumber, getUsersAsync)

const showFilterForm = ref(false)
const toggelFilterForm = () => {
  showFilterForm.value = !showFilterForm.value
}

const addUserCardBox = ref(false)
const toggelAddUserCardBox = () => {
  addUserCardBox.value = !addUserCardBox.value
}
const newUserModel = reactive({
  fullName: null,
  userName: null,
  password: null,
  phoneNumber: null,
  email: null,
  roles : null
})
const addNewUser = () => {
  post('api/User', newUserModel)
    .then((response) => {
      alert('User added')
      getUsersAsync()
    })
    .catch((e) => {
      showError.value = true
    })
}

const NameRole = (name) => {
  if (name === null) return true
  return name.length > 5 ? true : 'name mast be more the 5 letters'
}
 
const deleteDialog = ref(false)
const taggelDelete =()=>{
  deleteDialog.value = !deleteDialog.value
}
const deleteUsers = () => {
  isLoading.value = true
  del('api/User', selectedUsers.value)
    .then((response) => {
      taggelDelete()
      getUsersAsync()
    })
    .catch()
}

const disableUsers = () => {
  put('api/UserManagement/DisableUsers', null, selectedUsers.value)
    .then((response) => {
      getUsersAsync()
    })
    .catch()
}

const enableUsers = () => {
  put('api/UserManagement/EnableUsers', null, selectedUsers.value)
    .then((response) => {
      getUsersAsync()
    })
    .catch((e) => {
      console.log(e)
    })
}

const roles = ref([])
const getRoles = () => {
  get('api/role').then((response) => {
    roles.value = response.data
    console.log(roles.value)
  })
}
const dialog = ref(false)
const closeDialog = () => {
  dialog.value = false
}
const userInfoCard = ref({ edit: false, loading: false })
const editUser = ref(false)
const userDetailed = ref({roles:[{}]})
const getUserDerails = (id) => {
  get(`api/user/${id}`)
    .then((res) => {
      userDetailed.value = res.data
      console.log(res.data)
    })
    .catch((e) => {
      showError.value = true
    })
}
const showDialog = (id) => {
  getUserDerails(id)
  dialog.value = true
  editUser.value = false
}
const showEditDialog = (id) => {
  if (dialog.value === false) {
    getUserDerails(id)
    dialog.value = true
  }
  editUser.value = true
}

const updateUser = ()=>{
  put('api/user',userDetailed.value)
  .then((res)=>{
    getUsersAsync()
  })
  closeDialog()
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Users" main />
      <CardBox class="mb-6" has-table>
        <CardBox v-if="showError" :class="cardClass">
          <div class="space-y-3">
            <h1 class="text-2xl">same thing went wrong</h1>

            <p>{{ errorMessege }}</p>
          </div>
          <template #footer>
            <BaseButtons>
              <BaseButton label="Reload" color="danger" @click="getUsersAsync" />
            </BaseButtons>
          </template>
        </CardBox>
        <CardBox v-else>
          <div class="filter-btm">
            <BaseButton :icon="mdiFilter" variant="plain" elevation="5" @click="toggelFilterForm">
            </BaseButton>
            <BaseButton :icon="mdiAccountPlus" @click="toggelAddUserCardBox"> </BaseButton>

            <div v-if="selectedUsers.length" class="filter-btm">
              <BaseButton :icon="mdiDelete" @click="taggelDelete"> </BaseButton>
              <BaseButton :icon="mdiCheckCircle" @click="enableUsers"> </BaseButton>
              <BaseButton :icon="mdiCancel" @click="disableUsers"> </BaseButton>
            </div>
          </div>
          <CardBox v-show="addUserCardBox"
            ><v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="newUserModel.fullName"
                      label="Full Name"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newUserModel.userName"
                      label="User name"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field
                      v-model="newUserModel.email"
                      label="E-mail"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newUserModel.phoneNumber"
                      type="number"
                      label="Phone Number"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newUserModel.password"
                      label="Password"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="newUserModel.roles"
                      :items="roles"
                      item-title="name"
                      item-value="id"
                      label="Roles"
                      multiple
                      persistent-hint
                    ></v-select>
                  </v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="addNewUser">Add</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <CardBox v-show="showFilterForm">
            <v-form>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.fullName"
                      label="Full Name"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.userName"
                      label="User name"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.email"
                      label="E-mail"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.phoneNumber"
                      type="number"
                      label="Phone Number"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="filterModel.isEnabled"
                      :items="[
                        { title: 'Enabled', value: true },
                        { title: 'Disabled', value: false }
                      ]"
                      label="State"
                      clearable
                    ></v-select
                  ></v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="getUsersAsync">Filter</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <v-data-table
            v-model:items-per-page="filterModel.pageSize"
            :headers="columns"
            :items="items.data"
            v-model="selectedUsers"
            show-select
            :loading="isLoading"
          >
            <template v-slot:top>
              <v-dialog v-model="dialog" max-width="1000px">
                <v-card>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="userDetailed.fullName"
                            label="Full Name"
                            :disabled="!editUser"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="userDetailed.userName"
                            label="User Name"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="userDetailed.phoneNumber"
                            label="Phone"
                            :disabled="!editUser"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="userDetailed.email"
                            label="E-mail"
                            :disabled="!editUser"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                            v-model="userDetailed.roles"
                            :items="roles"
                            item-title="name"
                            item-value="id"
                            label="Roles"
                            :disabled="!editUser"
                            multiple
                          ></v-select>
                        </v-col>
                        <v-col class="item-btm" cols="12" md="4" sm="6">
                          <v-checkbox v-model="userDetailed.isEnabled" :disabled="!editUser"
                            >Enabled</v-checkbox
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
                      Cancel
                    </v-btn>
                    <v-btn v-show="editUser" color="blue-darken-1" variant="text" @click="updateUser">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="deleteDialog" max-width="1000px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="taggelDelete">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteUsers"
                      >Delete</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="item-btm">
                <BaseButton :icon="mdiAccountEdit" @click="showEditDialog(item.id)"></BaseButton>
                <BaseButton :icon="mdiInformation" @click="showDialog(item.id)"></BaseButton>
              </div>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"> </v-skeleton-loader>
            </template>
            <template v-slot:item.isEnabled="{ item }">
              <v-checkbox v-model="item.isEnabled" disabled></v-checkbox>
            </template>

            <template v-slot:bottom>
              <div>
                <v-pagination
                  v-model="pageNumber"
                  :length="items.pageCount"
                  total-visible="5"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>
        </CardBox>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style>
.filter-btm {
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
}
.item-btm {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.v-selection-control__input input {
  opacity: 1 !important;
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: #fff no-repeat center center;
}
.v-selection-control__input {
  width: unset;
  height: unset;
}
</style>
