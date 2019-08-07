import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Badge, IconButton, Divider, Typography, List, Toolbar, AppBar, Drawer, CssBaseline } from '@material-ui/core'
import { Switch, Route } from 'react-router-dom'
import moment from 'moment-timezone'
import CookieConsent from 'react-cookie-consent'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'

import Applied from './JobSearch'
import AssignmentList, { ComingSoon, ColdOutreach } from './Assignments'
import Profile from './Profile'
import Endorsement from './EndorsementChecklist'
import { dashboard as styles, withStyles } from '../MaterialUI/styles'
import { mainListItems, secondaryListItems } from './listItems'
import Calendar from './Calendar'

import Logo from '../Components/Images/Lambda_Logo_White.png'

const AdminDashboard = props => {

    const [state, setState] = useState({
        open: true,
        path: window.location.pathname.split('/')[2]
    })

    const handleDrawer = () => setState({ ...state, open: !state.open })

    useEffect(() => {
        if (state.open) setTimeout(() => { handleDrawer() }, 5000)
    }, [state.open])

    const { classes } = props

    return (

        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                // color="secondary"
                className={classNames(classes.appBar, state.open && classes.appBarShift)}
            >
                <Toolbar disableGutters={!state.open} className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawer}
                        className={classNames(classes.menuButton, state.open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        <img
                            alt="Lambda Logo"
                            src={Logo}
                            style={{
                                height: 'auto',
                                width: '100px'
                            }} />
                        <p> {moment().tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a')}</p>
                    </Typography>

                    <IconButton color="inherit">
                        <Badge badgeContent={1} color="primary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                classes={{
                    paper: classNames(classes.drawerPaper, !state.open && classes.drawerPaperClose)
                }}
                open={state.open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>

                <Divider />

                <List>{mainListItems}</List>

                <Divider />

                <List>{secondaryListItems}</List>
            </Drawer>

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Switch>
                    <Route path='/dashboard/profile' component={Profile} />
                    <Route path='/dashboard/assignments' component={AssignmentList} />
                    <Route path='/dashboard/calendar' component={Calendar} />
                    <Route path='/dashboard/endorsement' component={Endorsement} />
                    <Route path='/dashboard/applied-jobs' component={Applied} />
                    <Route path='/dashboard/cold-outreach' component={ColdOutreach} />
                    <Route path='/dashboard/coming-soon' component={ComingSoon} />
                </Switch>
            </main>

            <CookieConsent
                location="bottom"
                enableDeclineButton={true}
                // debug={true}
                declineButtonText="I decline"
                buttonText="I understand"
                cookieName="cookieConsent"
                style={{ background: '#BB1333', marginBottom: '15px' }}
                buttonStyle={{ color: '#BB1333', fontSize: '13px', background: 'white' }}
                expires={150}
            >
                This website uses cookies to enhance the user experience. <span style={{ fontSize: '10px' }} />
            </CookieConsent>
        </div>

    )

}

AdminDashboard.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AdminDashboard)