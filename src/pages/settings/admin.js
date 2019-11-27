import React from 'react'
import fetch from 'isomorphic-unfetch'
import Layout from '../../components/layout/index'
import Router from 'next/router'
import moment from 'moment-timezone'
import { NextAuth } from 'next-auth/client'
import RequireLogin from '../../components/requiredLogin'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import DateField from '../../components/aggrid/date'
import DateTimeField from '../../components/aggrid/datetime'
import DateTimeFieldApproval from '../../components/aggrid/datetimeapproval'
import ApprovedBtn from '../../components/aggrid/approvedbtn'
import ApprovedField from '../../components/aggrid/approved'
import {
  Container,
  Header,
  Content,
  Button,
  Modal,
  Alert,
  Panel,
  SelectPicker
} from 'rsuite'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion'

class Wrapper extends React.Component {
  static async getInitialProps ({ res, req, query }) {
    if (req && !req.user) {
      if (res) {
        res.writeHead(302, {
          Location: '/auth'
        })
        res.end()
      } else {
        Router.push('/auth')
      }
    }
    const host = req ? req.headers['x-forwarded-host'] : location.host
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:'
    const pageRequest = `${protocol}//${host}/api/user/list`
    const userRequest = await fetch(pageRequest)
    const userJson = await userRequest.json()
    return {
      session: await NextAuth.init({ req }),
      users: userJson,
      admin: query.admin
    }
  }

  constructor (props) {
    super(props)
    const lastYear = new Date().getFullYear() - 1
    const thisYear = new Date().getFullYear()
    this.state = {
      addCount: 0,
      updateCount: 0,
      showSyncModal: false,
      rowData: props.users.userList,
      allUsers: [],
      allRowData: [],
      allGridOptions: {
        defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
          selectable: false,
          editable: false
        },
        columnDefs: [
          {
            headerName: 'ID',
            field: 'id',
            hide: true,
            sort: { direction: 'asc', priority: 0 }
          }, {
            headerName: 'Name',
            field: 'name',
            tooltipField: 'name',
            width: 150
          }, {
            headerName: 'From',
            field: 'fromDate',
            tooltipField: 'fromDate',
            cellRenderer: 'dateShort',
            width: 100
          }, {
            headerName: 'To',
            field: 'toDate',
            tooltipField: 'toDate',
            cellRenderer: 'dateShort',
            width: 100
          }, {
            headerName: 'Requested Days',
            field: 'beantragt',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            },
            width: 160
          }, {
            headerName: `Days Remaining ${lastYear}`,
            field: 'resturlaubVorjahr',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            },
            width: 180
          }, {
            headerName: `Days Remaining ${thisYear}`,
            field: 'resturlaubJAHR',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            },
            width: 180
          }, {
            headerName: 'Days Remaining (Total)',
            field: 'jahresurlaubInsgesamt',
            tooltipField: 'jahresurlaubInsgesamt',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }
          }, {
            headerName: 'Days Remaining',
            field: 'restjahresurlaubInsgesamt',
            width: 160,
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }
          }, {
            headerName: 'Type',
            field: 'type',
            width: 130
          }, {
            headerName: 'Submitted',
            cellRenderer: 'dateTimeShort',
            field: 'submitted_datetime',
            width: 160
          }, {
            headerName: 'Approval Date/Time',
            field: 'approval_datetime',
            cellRenderer: 'dateTimeShortApproval',
            width: 160
          }, {
            headerName: 'Approved',
            field: 'approved',
            width: 140,
            cellRenderer: 'approvedbtn',
            pinned: 'right',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }
          }
        ],
        context: { componentParent: this },
        frameworkComponents: {
          dateTimeShort: DateTimeField,
          dateTimeShortApproval: DateTimeFieldApproval,
          dateShort: DateField,
          approvedbtn: ApprovedBtn
        },
        rowSelection: 'multiple',
        paginationPageSize: 10,
        rowClass: 'row-class'
      },
      personalRowData: [],
      personalGridOptions: {
        defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
          selectable: false,
          editable: false
        },
        columnDefs: [
          {
            headerName: 'ID',
            field: 'id',
            hide: true,
            sort: { direction: 'asc', priority: 0 }
          }, {
            headerName: 'From',
            field: 'fromDate',
            tooltipField: 'fromDate',
            cellRenderer: 'dateShort',
            width: 100
          }, {
            headerName: 'To',
            field: 'toDate',
            tooltipField: 'toDate',
            cellRenderer: 'dateShort',
            width: 100
          }, {
            headerName: 'Requested Days',
            field: 'beantragt',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            },
            width: 160
          }, {
            headerName: `Days Remaining ${lastYear}`,
            field: 'resturlaubVorjahr',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            },
            width: 180
          }, {
            headerName: `Days Remaining ${thisYear}`,
            field: 'resturlaubJAHR',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            },
            width: 180
          }, {
            headerName: 'Days Remaining (Total)',
            field: 'jahresurlaubInsgesamt',
            tooltipField: 'jahresurlaubInsgesamt',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }
          }, {
            headerName: 'Days Remaining',
            field: 'restjahresurlaubInsgesamt',
            width: 160,
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }
          }, {
            headerName: 'Type',
            field: 'type',
            width: 130
          }, {
            headerName: 'Submitted',
            cellRenderer: 'dateTimeShort',
            field: 'submitted_datetime',
            width: 160
          }, {
            headerName: 'Approval Date/Time',
            field: 'approval_datetime',
            cellRenderer: 'dateTimeShort',
            width: 160
          }, {
            headerName: 'Approved',
            field: 'approved',
            width: 120,
            cellRenderer: 'approved',
            pinned: 'right',
            cellStyle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }
          }
        ],
        context: { componentParent: this },
        frameworkComponents: {
          dateTimeShort: DateTimeField,
          dateShort: DateField,
          approved: ApprovedField
        },
        rowSelection: 'multiple',
        paginationPageSize: 10,
        rowClass: 'row-class'
      },
      gridOptions: {
        defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
          selectable: false,
          editable: false
        },
        columnDefs: [
          {
            headerName: 'ID',
            field: 'id',
            hide: true,
            sort: { direction: 'asc', priority: 0 }
          }, {
            headerName: 'First Name',
            field: 'fname',
            width: 120
          }, {
            headerName: 'Last Name',
            field: 'lname',
            width: 120
          }, {
            headerName: 'Email',
            field: 'email'
          }, {
            headerName: 'Team',
            field: 'team',
            width: 120
          }, {
            headerName: 'Date Joined',
            field: 'datejoined',
            cellRenderer: 'dateShort'
          }, {
            headerName: 'Days Remaining',
            field: 'daysremaining'
          }
        ],
        context: { componentParent: this },
        frameworkComponents: {
          dateShort: DateField
        },
        rowSelection: 'multiple',
        paginationPageSize: 10,
        rowClass: 'row-class'
      }
    }
  }

  handleAdGroupSync = () => {
    const host = window.location.host
    const protocol = window.location.protocol
    const adRequestUrl = `${protocol}//${host}/api/ad`
    fetch(adRequestUrl)
      .then(res => res.json())
      .then(data => {
        const adUsers = []
        data.users.map((user, index) => {
          const group = user.dn.split(',')[1]
          const groupName = group.substr(3, group.length)
          adUsers.push({ id: index, fname: user.givenName, lname: user.sn, email: user.mail, team: groupName })
        })
        const dbUsers = this.state.rowData
        let updateCount = 0
        let addCount = 0
        if (dbUsers > 0 && dbUsers.length !== adUsers.length) {
          dbUsers.forEach(user => {
            const dbUser = dbUsers.filter(duser => duser.email === user.email)
            if (user.fname !== dbUser.fname) user.update = 1 && updateCount++
            if (user.lname !== dbUser.lname) user.update = 1 && updateCount++
          })
        } else {
          addCount = adUsers.length - dbUsers.length
        }
        if (addCount > 0 || updateCount > 0) {
          this.setState({
            addCount: addCount,
            updateCount: updateCount,
            adUsers: adUsers,
            showSyncModal: true,
            rowData: adUsers
          })
        } else {
          Alert.success('User DB is up-to-date with your LDAP Users')
        }
      })
      .catch(err => console.error(err))
  }

  handleConfirmAdSync = () => {
    const {
      adUsers
    } = this.state

    if (adUsers.length > 0) {
      const host = window.location.host
      const protocol = window.location.protocol
      const adRequestUrl = `${protocol}//${host}/api/user/add?u=${JSON.stringify(adUsers)}`
      fetch(adRequestUrl)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.status === 200) {
            this.setState({
              showSyncModal: false
            })
            Alert.success(`Successfully added ${adUsers.length} users`, 5000)
          } else {
            this.setState({
              showSyncModal: false
            })
            Alert.warn(`Error adding ${adUsers.length} - ${data.error}`)
          }
        })
        .catch(err => console.error(err))
    }
  }

  componentDidMount () {
    const selectUserList = []
    this.props.users.userList.forEach(user => {
      selectUserList.push({ value: user.email, label: `${user.fname} ${user.lname}` })
    })
    this.setState({
      allUsers: selectUserList
    })
    const host = window.location.host
    const protocol = window.location.protocol
    fetch(`${protocol}//${host}/api/user/entries/all`)
      .then(res => res.json())
      .then(data => {
        if (data.userEntries) {
          this.setState({
            allRowData: data.userEntries
          })
          // window.gridApi && window.gridApi.refreshCells()
        }
      })
      .catch(err => console.error(err))
  }

  handleSyncModalClose = () => {
    this.setState({ showSyncModal: false })
  }

  open = () => {
    this.setState({ showSyncModal: true })
  }

  handleGridReady = params => {
    params.api.sizeColumnsToFit()
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  handlePersonalGridReady = params => {
    params.api.sizeColumnsToFit()
    this.personalGridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  handleAllGridReady = params => {
    params.api.sizeColumnsToFit()
    this.allGridApi = params.api
  }

  handlePersonalGridExport = () => {
    if (this.personalGridApi) {
      const email = this.state.userSelection.value
      const username = email.substr(0, email.lastIndexOf('@'))
      const params = {
        allColumns: true,
        fileName: `${username}_timeoff_${moment(new Date()).format('YYYYMMDD')}.csv`,
        columnSeparator: ','
      }
      this.personalGridApi.exportDataAsCsv(params)
    }
  }

  handlePersonalSelectChange = (data) => {
    console.log(data)
    const host = window.location.host
    const protocol = window.location.protocol
    fetch(`${protocol}//${host}/api/user/entries?user=${data}`)
      .then(res => res.json())
      .then(data => {
        if (data.userEntries) {
          this.setState({
            personalRowData: data.userEntries
          })
          // window.gridApi && window.gridApi.refreshCells()
        }
      })
      .catch(err => console.error(err))
  }

  handleAllGridExport = () => {
    if (this.allGridApi) {
      const params = {
        allColumns: true,
        fileName: `newtelco_allUsers_timeoff_${moment(new Date()).format('YYYYMMDD')}.csv`,
        columnSeparator: ','
      }
      this.allGridApi.exportDataAsCsv(params)
    }
  }

  render () {
    const {
      gridOptions,
      rowData,
      showSyncModal,
      addCount,
      updateCount,
      personalGridOptions,
      personalRowData,
      allUsers,
      allGridOptions,
      allRowData
    } = this.state

    if (this.props.session.user && this.props.admin) {
      return (
        <Layout user={this.props.session.user.email} token={this.props.session.csrfToken}>
          <Container className='settings-admin-container'>
            {/* <Panel bordered> */}
            <Accordion
              allowZeroExpanded
              preExpanded='3'
            >
              <AccordionItem uuid='1'>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <Header className='user-content-header'>
                      <span className='section-header'>
                        User List
                      </span>
                      <Button appearance='ghost' onClick={this.handleAdGroupSync}>Sync AD Groups</Button>
                    </Header>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <Panel bordered>
                    <Content className='user-grid-wrapper'>
                      <div className='ag-theme-material user-grid'>
                        <AgGridReact
                          gridOptions={gridOptions}
                          rowData={rowData}
                          onGridReady={this.handleGridReady}
                          animateRows
                          pagination
                        />
                      </div>
                    </Content>
                  </Panel>
                </AccordionItemPanel>
              </AccordionItem>
              <AccordionItem uuid='2'>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <Header className='user-content-header'>
                      <span className='section-header'>
                        Per Person
                      </span>
                      <Button appearance='ghost' onClick={this.handlePersonalGridExport}>Export</Button>
                    </Header>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <Panel bordered>
                    <Content className='user-grid-wrapper'>
                      <SelectPicker
                        onChange={this.handlePersonalSelectChange}
                        data={allUsers}
                        placeholder='Please Select a User'
                        style={{ width: '300px' }}
                      />
                      <div className='ag-theme-material user-grid'>
                        <AgGridReact
                          gridOptions={personalGridOptions}
                          rowData={personalRowData}
                          onGridReady={this.handlePersonalGridReady}
                          animateRows
                          pagination
                        />
                      </div>
                    </Content>
                  </Panel>
                </AccordionItemPanel>
              </AccordionItem>
              <AccordionItem uuid='3'>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <Header className='user-content-header'>
                      <span className='section-header'>
                        All Colleagues
                      </span>
                      <Button appearance='ghost' onClick={this.handleAllGridExport}>Export</Button>
                    </Header>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <Panel bordered>
                    <Content className='user-grid-wrapper'>
                      <div className='ag-theme-material user-grid'>
                        <AgGridReact
                          gridOptions={allGridOptions}
                          rowData={allRowData}
                          onGridReady={this.handleAllGridReady}
                          animateRows
                          pagination
                        />
                      </div>
                    </Content>
                  </Panel>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
            {/* </Panel> */}
          </Container>
          <Modal show={showSyncModal} onHide={this.handleSyncModalClose}>
            <Modal.Header>
              <Modal.Title>LDAP User Sync</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                You have <b>{updateCount}</b> Users which need to be updated and <b>{addCount}</b> users which need to be added.
              </p>
              <p>
                Would you like to proceed?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleConfirmAdSync} appearance='primary'>
                Submit
              </Button>
              <Button onClick={this.handleSyncModalClose} appearance='subtle'>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          <style jsx>{`
            :global(.settings-admin-container > .rs-panel) {
              margin: 10px;
            }
            :global(.accordion__heading) {
              background-color: #ececec;
              padding: 15px;
              border-radius: 5px;
              margin-top: 10px;
            }
            :global(.accordion__heading:hover) {
              cursor: pointer;
            }
            :global(.user-content-header) {
              display: flex;
              width: 100%;
              justify-content: space-between;
            }
            :global(.accordion__button:focus) {
              outline: none;
            }
            :global(.user-content-header:focus) {
              outline: none;
            }
            :global(.user-grid-wrapper) {
              height: 50vh;
            }
            :global(.user-grid) {
              height: 50vh;
            }
            :global(.row-awaitingResponse) {
              background-color: transparent;
            }
            :global(.section-header) {
              font-size: 1.3rem;
            }
          `}
          </style>
        </Layout>
      )
    } else {
      return <RequireLogin />
    }
  }
}

export default Wrapper
