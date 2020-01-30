import React from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import { NextAuth } from 'next-auth/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGoogle
} from '@fortawesome/free-brands-svg-icons'
import '../../style/newtelco-rsuite.less'
import {
  Divider,
  ControlLabel,
  FormControl,
  HelpBlock,
  Container,
  Content,
  Footer,
  FlexboxGrid,
  Panel,
  Form,
  FormGroup,
  ButtonToolbar,
  Button,
  Col
} from 'rsuite'
import Wrapper from './wrapper'

export default class App extends React.Component {
  static async getInitialProps ({ req }) {
    return {
      session: await NextAuth.init({ req }),
      linkedAccounts: await NextAuth.linked({ req }),
      providers: await NextAuth.providers({ req })
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      session: this.props.session
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleSignInSubmit = this.handleSignInSubmit.bind(this)
  }

  componentDidMount () {
    const host = window.location.host
    const protocol = window.location.protocol
    fetch(`${protocol}//${host}/api/settings/company/info`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.setState({
            companyName: data.companyInfo[0].companyName
          })
        }
      })
      .catch(err => console.error(err))
  }

  handleEmailChange (event) {
    this.setState({
      email: event.target.value
    })
  }

  handleSignInSubmit (event) {
    event.preventDefault()

    if (!this.state.email) return

    NextAuth.signin(this.state.email)
      .then(() => {
        Router.push(`/auth/check-email?email=${this.state.email}`)
      })
      .catch(() => {
        Router.push(`/auth/error?action=signin&type=email&email=${this.state.email}`)
      })
  }

  render () {
    if (this.props.session.user) {
      return (
        <Wrapper>
          <LinkAccounts
            session={this.props.session}
            linkedAccounts={this.props.linkedAccounts}
          />
        </Wrapper>
      )
    } else {
      return (
        <div className='show-fake-browser login-page'>
          <Container className='login-wrapper'>
            <Content className='login-content-wrapper'>
              <FlexboxGrid style={{ marginTop: '2rem' }} justify='center'>
                <FlexboxGrid.Item componentClass={Col} md={8} lg={6}>
                  <Panel header={<h3 className='login-text-header'>Login</h3>} bordered>
                    <Form fluid id='signin' method='post' action='/auth/email/signin' onSubmit={this.handleSignInSubmit}>
                      <input name='_csrf' type='hidden' value={this.state.session.csrfToken} />
                      <FormGroup>
                        <ControlLabel style={{ display: 'inline' }}>Email Address</ControlLabel>
                        <HelpBlock style={{ marginTop: '-1px' }} tooltip>Not Required with Google Login</HelpBlock>
                        <FormControl style={{ width: '100%', marginTop: '10px' }} name='email' type='text' value={this.state.email} onChange={formValue => { this.setState({ email: formValue }) }} placeholder='jcleese@newtelco.de' />
                      </FormGroup>
                      <Divider />
                      <FormGroup>
                        <ButtonToolbar>
                          <SignInButtons providers={this.props.providers} />
                          <Button appearance='subtle' id='submitButton' type='submit' style={{ width: '50%' }} className='btn btn-outline-success' disabled>Sign In</Button>
                        </ButtonToolbar>
                      </FormGroup>
                    </Form>
                  </Panel>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </Content>
            <Footer className='login-footer-wrapper'>
              {this.state.companyName
                ? (
                  `${this.state.companyName} ${new Date().getFullYear()}`
                ) : (
                  null
                )}
            </Footer>
          </Container>
          <style jsx>{`
            .text-center {
              margin: 100px 0 50px 0;
            } 
            :global(.rs-panel-heading) {
              background-color: #67b246;
              color: #fff;
            }
            :global(.rs-panel-body) {
              background-color: #fff;
            }
            :global(.rs-panel-bordered) {
              margin-top: 50px;
              box-shadow: 0 2px 0 rgba(90,97,105,.11), 0 4px 8px rgba(90,97,105,.12), 0 10px 10px rgba(90,97,105,.06), 0 7px 70px rgba(90,97,105,.1);
            }
            :global(.login-page) {
              display: flex;
              flex-direction: column;
            }
            :global(.login-wrapper) {
              height: 100vh;
            }
            :global(.login-text-header) {
              font-weight: 100;
            }
            :global(.login-header-wrapper) {

            }
            :global(.login-content-wrapper) {
              background-color: #f5f6f8;
              flex-grow: 1;
            }
            :global(.login-footer-wrapper) {
              height: 56px;
              display: flex;
              padding: 10px 30px;
              align-items: center;
              background-color: #e4e4e4;
            }
            :global(a.btn-outline-secondary:hover) {
              text-decoration: none;
            }
            #email::placeholder {
              opacity: 0.4;
            }
          `}
          </style>
        </div>
      )
    }
  }
}

export class LinkAccounts extends React.Component {
  render () {
    return (
      <Panel header={<h3 className='login-text-header'>Link Accounts</h3>} bordered>
        <p style={{ marginTop: '20px', marginBottom: '20px' }}>You are signed in as <span style={{ fontWeight: '600' }}>{this.props.session.user.email}</span>.</p>
        <div style={{ display: 'inline', marginTop: '10px' }}>
          <Link href='/'>
            <Button appearance='primary' type='submit' style={{ width: '48%' }}>
                    Back
            </Button>
          </Link>
          {
            Object.keys(this.props.linkedAccounts).map((provider, i) => {
              return <LinkAccount key={i} provider={provider} session={this.props.session} linked={this.props.linkedAccounts[provider]} />
            })
          }
        </div>
      </Panel>
    )
  }
}

export class LinkAccount extends React.Component {
  render () {
    if (this.props.linked === true) {
      return (
        <form style={{ display: 'inline', marginLeft: '10px' }} method='post' action={`/auth/oauth/${this.props.provider.toLowerCase()}/unlink`}>
          <input name='_csrf' type='hidden' value={this.props.session.csrfToken} />
          <Button appearance='secondary' type='submit' style={{ width: '48%' }}>
              Unlink from {this.props.provider}
          </Button>
        </form>
      )
    } else {
      return (
        <p>
          <a className='btn btn-block btn-outline-primary' href={`/auth/oauth/${this.props.provider.toLowerCase()}`}>
            Link with {this.props.provider}
          </a>
        </p>
      )
    }
  }
}

export class SignInButtons extends React.Component {
  render () {
    return (
      <>
        {
          Object.keys(this.props.providers).map((provider, i) => {
            return (
              <a key={i} className='btn btn-block btn-outline-secondary' href={this.props.providers[provider].signin}>
                <Button style={{ width: '48%', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-around' }} className='google-signin-btn' appearance='primary'>
                  <FontAwesomeIcon icon={faGoogle} width='1em' style={{ float: 'left', color: 'secondary' }} />
                  Sign in with {provider}
                </Button>
              </a>
            )
          })
        }
      </>
    )
  }
}
