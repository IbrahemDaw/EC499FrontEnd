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
  { title: 'Role Name', value: 'name' },
  { title: 'Enabled', value: 'isEnabled' },
  { title: 'Actions', key: 'actions' }
]
const selectedroles = ref([])
const items = ref({})
const isLoading = ref(false)
const showError = ref(false)
const pageNumber = ref(1)
const filterModel = ref({
  name: null,
  isEnabled: null,
  pageNumber: 1,
  pageSize: 10
})
const getRolesAsync = () => {
  isLoading.value = true
  filterModel.value.pageNumber = pageNumber.value
  get('api/role/filter', filterModel.value)
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
  getRolesAsync()
  getPermissions()
})
watch(pageNumber, getRolesAsync)

const showFilterForm = ref(false)
const toggelFilterForm = () => {
  showFilterForm.value = !showFilterForm.value
}

const addroleCardBox = ref(false)
const toggelAddroleCardBox = () => {
  addroleCardBox.value = !addroleCardBox.value
}
const newRoleModel = reactive({
  name: null,
  isEnabled: false,
  permissionIds: []
})
const addNewrole = () => {
  console.log(newRoleModel)
  post('api/role', newRoleModel)
    .then((response) => {
      alert('role added')
      getRolesAsync()
    })
    .catch((e) => {
      console.log(e)
      showError.value = true
    })
}

const deleteDialog = ref(false)
const taggelDelete = () => {
  deleteDialog.value = !deleteDialog.value
}
const deleteroles = () => {
  isLoading.value = true
  del('api/role', selectedroles.value)
    .then((response) => {
      taggelDelete()
      getRolesAsync()
    })
    .catch()
}

const disableroles = () => {
  put('api/userManagement/Disableroles', null, selectedroles.value)
    .then((response) => {
      getRolesAsync()
    })
    .catch()
}

const enableroles = () => {
  put('api/userManagement/Enableroles', null, selectedroles.value)
    .then((response) => {
      getRolesAsync()
    })
    .catch((e) => {
      console.log(e)
    })
}

const permission = ref([])
const selectedRoles = ref([])
const getPermissions = () => {
  get('api/userManagement/permission').then((response) => {
    permission.value = response.data
  })
}
const dialog = ref(false)
const closeDialog = () => {
  dialog.value = false
}
const editrole = ref(false)
const roleDetailed = ref({})
const getroleDerails = (id) => {
  get(`api/role/${id}`)
    .then((res) => {
      roleDetailed.value = res.data
    })
    .catch((e) => {
      showError.value = true
    })
}
const showDialog = (id) => {
  getroleDerails(id)
  dialog.value = true
  editrole.value = false
}
const showEditDialog = (id) => {
  if (dialog.value === false) {
    getroleDerails(id)
    dialog.value = true
  }
  editrole.value = true
}

const updaterole = () => {
  put('api/role', roleDetailed.value).then((res) => {
    getRolesAsync()
  })
  closeDialog()
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Roles" main />
      <CardBox class="mb-6" has-table>
        <CardBox v-if="showError" :class="cardClass">
          <div class="space-y-3">
            <h1 class="text-2xl">same thing went wrong</h1>

            <p>{{ errorMessege }}</p>
          </div>
          <template #footer>
            <BaseButtons>
              <BaseButton label="Reload" color="danger" @click="getRolesAsync" />
            </BaseButtons>
          </template>
        </CardBox>
        <CardBox v-else>
          <div class="filter-btm">
            <BaseButton :icon="mdiFilter" variant="plain" elevation="5" @click="toggelFilterForm">
            </BaseButton>
            <BaseButton :icon="mdiAccountPlus" @click="toggelAddroleCardBox"> </BaseButton>

            <div v-if="selectedroles.length" class="filter-btm">
              <BaseButton :icon="mdiDelete" @click="taggelDelete"> </BaseButton>
              <BaseButton :icon="mdiCheckCircle" @click="enableroles"> </BaseButton>
              <BaseButton :icon="mdiCancel" @click="disableroles"> </BaseButton>
            </div>
          </div>
          <CardBox v-show="addroleCardBox"
            ><v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="newRoleModel.name"
                      label="Name"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="newRoleModel.permissionIds"
                      :items="permission"
                      item-title="name"
                      item-value="id"
                      label="Permission"
                      multiple
                      persistent-hint
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="newRoleModel.isEnabled"
                      :items="[
                        { title: 'Enabled', value: true },
                        { title: 'Disabled', value: false }
                      ]"
                      label="State"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="addNewrole">Add</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <CardBox v-show="showFilterForm">
            <v-form>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.name"
                      label="Full Name"
                      hide-details
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
                <v-btn :loading="isLoading" @click="getRolesAsync">Filter</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <v-data-table
            v-model:items-per-page="filterModel.pageSize"
            :headers="columns"
            :items="items.data"
            v-model="selectedroles"
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
                            v-model="roleDetailed.name"
                            label="Name"
                            :disabled="!editrole"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                            v-model="roleDetailed.permissions"
                            :items="permission"
                            item-title="name"
                            item-value="id"
                            label="Permission"
                            :disabled="!editrole"
                            multiple
                          ></v-select>
                        </v-col>
                        <v-col class="item-btm" cols="12" md="4" sm="6">
                          <v-checkbox v-model="roleDetailed.isEnabled" :disabled="!editrole"
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
                    <v-btn
                      v-show="editrole"
                      color="blue-darken-1"
                      variant="text"
                      @click="updaterole"
                    >
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
                    <v-btn color="blue-darken-1" variant="text" @click="deleteroles">Delete</v-btn>
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
                  :length="items.pageCount < pageNumber ? pageNumber : items.pageCount"
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
